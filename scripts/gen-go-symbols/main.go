// Regenerates the editor catalog from the Go standard library.
// Run from this directory: go run . -out ..\..\src\features\practice\constants\symbols.json
package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"go/ast"
	"go/build"
	"go/doc"
	"go/parser"
	"go/printer"
	"go/token"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

const (
	kindFunction   = "function"
	maxExampleLine = 8
	synopsisLimit  = 280
)

func main() {
	outPath := flag.String("out", "", "symbols.json path")
	flag.Parse()
	if *outPath == "" {
		fmt.Fprintln(os.Stderr, "missing -out")
		os.Exit(1)
	}
	root := filepath.Join(build.Default.GOROOT, "src")
	symbols, err := collectLibrary(root)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	sort.Slice(symbols, func(i, j int) bool {
		if symbols[i].Name == symbols[j].Name {
			return symbols[i].ImportPath < symbols[j].ImportPath
		}
		return symbols[i].Name < symbols[j].Name
	})
	noteCollisions(symbols)
	if err := writeJSON(*outPath, symbols); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
	fmt.Fprintf(os.Stderr, "wrote %d symbols\n", len(symbols))
}

type symbol struct {
	Name       string    `json:"name"`
	Signature  string    `json:"signature"`
	Summary    localized `json:"summary"`
	Example    string    `json:"example"`
	Kind       string    `json:"kind"`
	ImportPath string    `json:"-"`
}

type localized struct {
	Th string `json:"th"`
	En string `json:"en"`
}

func collectLibrary(root string) ([]symbol, error) {
	var symbols []symbol
	err := filepath.WalkDir(root, func(dir string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil || !entry.IsDir() {
			return walkErr
		}
		name := entry.Name()
		if dir != root && skipDir(name) {
			return filepath.SkipDir
		}
		rel := importPath(root, dir)
		if rel == "cmd" {
			return filepath.SkipDir
		}
		if dir == root {
			return nil
		}
		found, err := symbolsIn(dir, importPath(root, dir))
		if err != nil {
			fmt.Fprintf(os.Stderr, "skip %s: %v\n", importPath(root, dir), err)
			return nil
		}
		symbols = append(symbols, found...)
		return nil
	})
	return symbols, err
}

func skipDir(name string) bool {
	return name == "internal" || name == "vendor" || name == "testdata" || strings.HasPrefix(name, ".")
}

func importPath(root, dir string) string {
	rel, err := filepath.Rel(root, dir)
	if err != nil {
		return ""
	}
	return filepath.ToSlash(rel)
}

func symbolsIn(dir, importPath string) ([]symbol, error) {
	fset := token.NewFileSet()
	files, err := parseDir(fset, dir)
	if err != nil || len(files) == 0 {
		return nil, err
	}
	var mode doc.Mode = doc.PreserveAST
	if importPath == "builtin" {
		mode |= doc.AllDecls
	}
	pkg, err := doc.NewFromFiles(fset, files, importPath, mode)
	if err != nil || pkg.Name == "" || pkg.Name == "main" {
		return nil, err
	}
	builder := &builder{fset: fset, pkgName: pkg.Name, importPath: importPath}
	return builder.symbols(pkg), nil
}

func parseDir(fset *token.FileSet, dir string) ([]*ast.File, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	var files []*ast.File
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".go") {
			continue
		}
		match, matchErr := build.Default.MatchFile(dir, entry.Name())
		if matchErr != nil || !match {
			continue
		}
		parsed, parseErr := parser.ParseFile(fset, filepath.Join(dir, entry.Name()), nil, parser.ParseComments|parser.SkipObjectResolution)
		if parseErr != nil {
			continue
		}
		files = append(files, parsed)
	}
	return files, nil
}

type builder struct {
	fset       *token.FileSet
	pkgName    string
	importPath string
	seen       map[string]bool
}

func (b *builder) symbols(pkg *doc.Package) []symbol {
	b.seen = map[string]bool{}
	var out []symbol
	for _, fn := range pkg.Funcs {
		out = append(out, b.function(fn))
	}
	for _, typ := range pkg.Types {
		for _, fn := range typ.Funcs {
			out = append(out, b.function(fn))
		}
		_, iface := interfaceType(typ)
		out = append(out, b.interfaceMethods(typ)...)
		for _, fn := range typ.Methods {
			if fn.Level > 0 {
				continue
			}
			out = append(out, b.method(typ, fn, iface))
		}
	}
	var kept []symbol
	for _, item := range out {
		if item.Name != "" {
			kept = append(kept, item)
		}
	}
	return kept
}

func (b *builder) function(fn *doc.Func) symbol {
	name := qualify(b.pkgName, fn.Name)
	return b.add(name, fn.Decl, fn.Doc, fn.Examples, synthCall(name, fn.Decl))
}

func (b *builder) method(typ *doc.Type, fn *doc.Func, iface bool) symbol {
	name := qualify(b.pkgName, typ.Name+"."+fn.Name)
	fallback := methodCall(b.pkgName, typ.Name, fn, iface)
	return b.add(name, fn.Decl, fn.Doc, fn.Examples, fallback)
}

func (b *builder) add(name string, decl *ast.FuncDecl, docText string, examples []*doc.Example, fallback string) symbol {
	signature := b.signature(decl)
	key := name + "\n" + signature
	if b.seen[key] {
		return symbol{}
	}
	b.seen[key] = true
	summary := synopsis(docText)
	example := b.exampleText(examples)
	if example == "" {
		example = fallback
	}
	return symbol{
		Name:       name,
		Signature:  signature,
		Summary:    localized{Th: summary, En: summary},
		Example:    example,
		Kind:       kindFunction,
		ImportPath: b.importPath,
	}
}

func qualify(pkgName, local string) string {
	if pkgName == "builtin" {
		return local
	}
	return pkgName + "." + local
}

func (b *builder) signature(decl *ast.FuncDecl) string {
	if decl == nil {
		return ""
	}
	body, comment := decl.Body, decl.Doc
	decl.Body, decl.Doc = nil, nil
	defer func() {
		decl.Body, decl.Doc = body, comment
	}()
	var buf bytes.Buffer
	cfg := printer.Config{Mode: printer.UseSpaces | printer.TabIndent, Tabwidth: 4}
	if err := cfg.Fprint(&buf, b.fset, decl); err != nil {
		return "func " + decl.Name.Name + "(...)"
	}
	return strings.Join(strings.Fields(buf.String()), " ")
}

func (b *builder) exampleText(examples []*doc.Example) string {
	for _, example := range examples {
		text := b.printBlock(example.Code)
		if text == "" {
			continue
		}
		lines := strings.Split(text, "\n")
		if len(lines) > maxExampleLine {
			lines = lines[:maxExampleLine]
		}
		return strings.Join(lines, "\n")
	}
	return ""
}

func (b *builder) printBlock(node ast.Node) string {
	block, ok := node.(*ast.BlockStmt)
	if !ok {
		return ""
	}
	var lines []string
	cfg := printer.Config{Mode: printer.UseSpaces | printer.TabIndent, Tabwidth: 4}
	for _, stmt := range block.List {
		var buf bytes.Buffer
		if err := cfg.Fprint(&buf, b.fset, stmt); err != nil {
			continue
		}
		line := strings.TrimSpace(buf.String())
		if line != "" {
			lines = append(lines, line)
		}
	}
	return strings.Join(lines, "\n")
}

func synopsis(text string) string {
	clean := doc.Synopsis(text)
	if clean == "" {
		return "See the signature for arguments and results."
	}
	if len(clean) <= synopsisLimit {
		return clean
	}
	cut := synopsisLimit
	for cut > 0 && clean[cut-1]&0xC0 == 0x80 {
		cut--
	}
	return strings.TrimSpace(clean[:cut]) + "..."
}

func (b *builder) interfaceMethods(typ *doc.Type) []symbol {
	iface, ok := interfaceType(typ)
	if !ok || iface.Methods == nil {
		return nil
	}
	var out []symbol
	for _, field := range iface.Methods.List {
		fnType, isFunc := field.Type.(*ast.FuncType)
		if !isFunc {
			continue
		}
		docText := fieldText(field)
		if docText == "" {
			docText = typ.Doc
		}
		for _, name := range field.Names {
			if !name.IsExported() {
				continue
			}
			decl := &ast.FuncDecl{
				Name: name,
				Recv: &ast.FieldList{List: []*ast.Field{{Type: ast.NewIdent(typ.Name)}}},
				Type: fnType,
			}
			local := typ.Name + "." + name.Name
			fn := &doc.Func{Name: name.Name, Decl: decl, Recv: typ.Name}
			out = append(out, b.add(qualify(b.pkgName, local), decl, docText, nil, methodCall(b.pkgName, typ.Name, fn, true)))
		}
	}
	return out
}

func interfaceType(typ *doc.Type) (*ast.InterfaceType, bool) {
	if typ.Decl == nil || len(typ.Decl.Specs) == 0 {
		return nil, false
	}
	spec, ok := typ.Decl.Specs[0].(*ast.TypeSpec)
	if !ok {
		return nil, false
	}
	iface, ok := spec.Type.(*ast.InterfaceType)
	return iface, ok
}

func fieldText(field *ast.Field) string {
	if field.Doc != nil {
		return field.Doc.Text()
	}
	if field.Comment != nil {
		return field.Comment.Text()
	}
	return ""
}

func noteCollisions(symbols []symbol) {
	paths := map[string]map[string]bool{}
	for _, item := range symbols {
		if paths[item.Name] == nil {
			paths[item.Name] = map[string]bool{}
		}
		paths[item.Name][item.ImportPath] = true
	}
	for i, item := range symbols {
		if len(paths[item.Name]) < 2 {
			continue
		}
		note := "(" + item.ImportPath + ") "
		symbols[i].Summary.Th = note + item.Summary.Th
		symbols[i].Summary.En = note + item.Summary.En
	}
}

func namedType(pkgName, typeName string) string {
	if pkgName == "builtin" {
		return typeName
	}
	return pkgName + "." + typeName
}

func methodCall(pkgName, typeName string, fn *doc.Func, iface bool) string {
	recv := "v"
	if fn.Decl != nil && fn.Decl.Recv != nil && len(fn.Decl.Recv.List) > 0 && len(fn.Decl.Recv.List[0].Names) > 0 {
		recv = fn.Decl.Recv.List[0].Names[0].Name
	}
	var init string
	switch {
	case iface:
		init = "var " + recv + " " + namedType(pkgName, typeName)
	case strings.HasPrefix(fn.Recv, "*"):
		init = recv + " := new(" + namedType(pkgName, typeName) + ")"
	default:
		init = recv + " := " + namedType(pkgName, typeName) + "{}"
	}
	return init + "\n" + synthCall(recv+"."+fn.Name, fn.Decl)
}

func synthCall(callee string, decl *ast.FuncDecl) string {
	if decl == nil || decl.Type == nil {
		return callee + "()"
	}
	call := callee + "(" + strings.Join(argList(decl.Type.Params), ", ") + ")"
	return resultPrefix(decl.Type.Results) + call
}

func argList(params *ast.FieldList) []string {
	if params == nil {
		return nil
	}
	var args []string
	for _, field := range params.List {
		count := len(field.Names)
		if count == 0 {
			count = 1
		}
		value := dummy(field.Type)
		for range count {
			args = append(args, value)
		}
	}
	return args
}

func resultPrefix(results *ast.FieldList) string {
	names := resultNames(results)
	if len(names) == 0 {
		return ""
	}
	return strings.Join(names, ", ") + " := "
}

func resultNames(results *ast.FieldList) []string {
	if results == nil {
		return nil
	}
	var names []string
	var last ast.Expr
	for _, field := range results.List {
		if len(field.Names) == 0 {
			names = append(names, "")
		} else {
			for _, id := range field.Names {
				names = append(names, id.Name)
			}
		}
		last = field.Type
	}
	errLast := isIdent(last, "error")
	for i, name := range names {
		if name != "" && name != "_" {
			continue
		}
		switch {
		case i == len(names)-1 && errLast:
			names[i] = "err"
		case len(names) == 1:
			names[i] = "got"
		default:
			names[i] = fmt.Sprintf("v%d", i+1)
		}
	}
	return names
}

func dummy(expr ast.Expr) string {
	switch typed := expr.(type) {
	case *ast.Ident:
		return dummyIdent(typed.Name)
	case *ast.Ellipsis:
		return dummy(typed.Elt)
	case *ast.StarExpr, *ast.InterfaceType, *ast.FuncType:
		return "nil"
	case *ast.ArrayType:
		if typed.Len == nil && isIdent(typed.Elt, "byte") {
			return `[]byte("text")`
		}
		return "{}"
	case *ast.MapType:
		return "nil"
	case *ast.ChanType:
		return "nil"
	case *ast.SelectorExpr:
		return dummySelector(typed)
	default:
		return "nil"
	}
}

func dummyIdent(name string) string {
	switch name {
	case "string":
		return `"text"`
	case "bool":
		return "true"
	case "byte":
		return "0"
	case "rune":
		return "'A'"
	case "error", "any":
		return "nil"
	case "int", "int8", "int16", "int32", "int64", "uint", "uint8", "uint16", "uint32", "uint64", "uintptr", "float32", "float64", "complex64", "complex128":
		return "1"
	default:
		return "nil"
	}
}

func dummySelector(sel *ast.SelectorExpr) string {
	pkg, ok := sel.X.(*ast.Ident)
	if !ok {
		return "nil"
	}
	switch pkg.Name + "." + sel.Sel.Name {
	case "context.Context":
		return "context.Background()"
	case "time.Duration":
		return "time.Second"
	case "time.Time":
		return "time.Now()"
	case "io.Reader":
		return `strings.NewReader("text")`
	case "io.Writer":
		return "io.Discard"
	default:
		return "nil"
	}
}

func isIdent(expr ast.Expr, name string) bool {
	id, ok := expr.(*ast.Ident)
	return ok && id.Name == name
}

func writeJSON(path string, symbols []symbol) error {
	cleaned := make([]symbol, 0, len(symbols))
	for _, item := range symbols {
		if item.Name != "" {
			cleaned = append(cleaned, item)
		}
	}
	file, err := os.Create(path)
	if err != nil {
		return err
	}
	defer file.Close()
	enc := json.NewEncoder(file)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "  ")
	if err := enc.Encode(cleaned); err != nil {
		return err
	}
	return nil
}
