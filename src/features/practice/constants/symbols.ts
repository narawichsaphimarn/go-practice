import type { Localized } from "../../../content/types.ts";
import generatedFile from "./symbols.json";

export const KIND_FUNCTION = "function";
export const KIND_CONSTANT = "constant";
export const KIND_TYPE = "type";

export type SymbolKind = typeof KIND_FUNCTION | typeof KIND_CONSTANT | typeof KIND_TYPE;

export type GoSymbol = {
  name: string;
  signature: string;
  summary: Localized;
  example: string;
  kind: SymbolKind;
};

function symbol(name: string, signature: string, th: string, en: string, example: string, kind: SymbolKind = KIND_FUNCTION): GoSymbol {
  return { name, signature, summary: { th, en }, example, kind };
}

const curatedSymbols: GoSymbol[] = [
  symbol("fmt.Println", "func Println(a ...any) (n int, err error)", "พิมพ์ค่าคั่นด้วยช่องว่าง แล้วขึ้นบรรทัดใหม่", "Print values separated by spaces, then a newline.", `fmt.Println("hi", 1)`),
  symbol("fmt.Printf", "func Printf(format string, a ...any) (n int, err error)", "พิมพ์ตามรูปแบบที่กำหนด", "Print using a format string.", `fmt.Printf("n=%d\\n", 3)`),
  symbol("fmt.Sprintf", "func Sprintf(format string, a ...any) string", "สร้างสตริงตามรูปแบบ โดยไม่พิมพ์ออกจอ", "Build a string from a format, without printing it.", `s := fmt.Sprintf("%d", 3)`),
  symbol("fmt.Errorf", "func Errorf(format string, a ...any) error", "สร้าง error จากข้อความรูปแบบ", "Create an error from a format string.", `err := fmt.Errorf("port %d", 80)`),
  symbol("errors.New", "func New(text string) error", "สร้าง error จากข้อความ", "Create an error from text.", `err := errors.New("empty")`),
  symbol("errors.Is", "func Is(err, target error) bool", "ตรวจว่า err เป็น target หรือถูกห่อไว้ด้วย target", "Report whether err is or wraps target.", `errors.Is(err, os.ErrNotExist)`),
  symbol("errors.As", "func As(err error, target any) bool", "แกะ error ที่ถูกห่อไว้ให้เป็นชนิดที่ต้องการ", "Unwrap err into the type pointed to by target.", `errors.As(err, &pathErr)`),
  symbol("json.Marshal", "func Marshal(v any) ([]byte, error)", "แปลงค่าเป็น JSON", "Encode a value as JSON.", `b, err := json.Marshal(user)`),
  symbol("json.Unmarshal", "func Unmarshal(data []byte, v any) error", "อ่าน JSON ลงในตัวแปรที่ส่งเข้าไป", "Decode JSON into the value pointed to by v.", `err := json.Unmarshal(b, &user)`),
  symbol("net.JoinHostPort", "func JoinHostPort(host, port string) string", "รวม host กับ port เป็น host:port", "Join host and port into host:port.", `net.JoinHostPort("127.0.0.1", "8080")`),
  symbol("net.SplitHostPort", "func SplitHostPort(hostport string) (host, port string, err error)", "แยก host กับ port ออกจากกัน", "Split host:port into host and port.", `host, port, err := net.SplitHostPort("127.0.0.1:8080")`),
  symbol("http.StatusOK", "const StatusOK = 200", "รหัสสถานะ HTTP 200", "HTTP status code 200.", `status == http.StatusOK`, KIND_CONSTANT),
  symbol("http.ListenAndServe", "func ListenAndServe(addr string, handler Handler) error", "เปิดเซิร์ฟเวอร์ HTTP ที่ที่อยู่ที่กำหนด", "Start an HTTP server on addr.", `http.ListenAndServe(":8080", nil)`),
  symbol("context.WithCancel", "func WithCancel(parent Context) (ctx Context, cancel CancelFunc)", "สร้าง context ที่ยกเลิกได้จาก parent", "Return a child context that cancel stops.", "ctx, cancel := context.WithCancel(context.Background())\ndefer cancel()"),
  symbol("context.WithTimeout", "func WithTimeout(parent Context, timeout Duration) (Context, CancelFunc)", "สร้าง context ที่ถูกยกเลิกเมื่อครบเวลา", "Return a child context that ends after timeout.", "ctx, cancel := context.WithTimeout(context.Background(), time.Second)\ndefer cancel()"),
  symbol("slog.Info", "func Info(msg string, args ...any)", "บันทึก log ระดับ Info", "Log a message at Info level.", `slog.Info("ready", "port", 8080)`),
  symbol("strings.Contains", "func Contains(s, substr string) bool", "ตรวจว่า s มี substr อยู่หรือไม่", "Report whether substr is inside s.", `strings.Contains("hello", "ell")`),
  symbol("strings.Join", "func Join(elems []string, sep string) string", "ต่อสตริงด้วยตัวคั่น", "Join strings with a separator.", `strings.Join([]string{"a", "b"}, ",")`),
  symbol("strconv.IntSize", "const IntSize = 32 or 64", "จำนวนบิตของ int บนเครื่องนี้", "Size of an int in bits on this machine.", "strconv.IntSize", KIND_CONSTANT),
  symbol("strconv.ErrRange", `var ErrRange = errors.New("value out of range")`, "ค่าอยู่นอกช่วงที่ชนิดนั้นรับได้", "The value is out of range for the target type.", "errors.Is(err, strconv.ErrRange)", KIND_CONSTANT),
  symbol("strconv.ErrSyntax", `var ErrSyntax = errors.New("invalid syntax")`, "ข้อความไม่ใช่รูปแบบตัวเลขที่ถูก", "The text is not a valid number.", "errors.Is(err, strconv.ErrSyntax)", KIND_CONSTANT),
  symbol("strconv.AppendBool", "func AppendBool(dst []byte, b bool) []byte", `ต่อ "true" หรือ "false" ท้าย dst`, "Append true or false to dst.", "dst = strconv.AppendBool(dst, true)"),
  symbol("strconv.AppendFloat", "func AppendFloat(dst []byte, f float64, fmt byte, prec, bitSize int) []byte", "ต่อทศนิยมที่จัดรูปแบบแล้วท้าย dst", "Append a formatted float to dst.", "dst = strconv.AppendFloat(dst, 3.14, 'f', 2, 64)"),
  symbol("strconv.AppendInt", "func AppendInt(dst []byte, i int64, base int) []byte", "ต่อจำนวนเต็มในฐาน base ท้าย dst", "Append an integer in the given base to dst.", "dst = strconv.AppendInt(dst, -42, 10)"),
  symbol("strconv.AppendQuote", "func AppendQuote(dst []byte, s string) []byte", "ต่อ s ในรูป Go string literal ท้าย dst", "Append s as a Go string literal to dst.", `dst = strconv.AppendQuote(dst, "hi")`),
  symbol("strconv.AppendQuoteRune", "func AppendQuoteRune(dst []byte, r rune) []byte", "ต่อ rune ในรูป Go rune literal ท้าย dst", "Append r as a Go rune literal to dst.", "dst = strconv.AppendQuoteRune(dst, 'A')"),
  symbol("strconv.AppendQuoteRuneToASCII", "func AppendQuoteRuneToASCII(dst []byte, r rune) []byte", "เหมือน AppendQuoteRune แต่ตัวที่ไม่ใช่ ASCII ถูก escape", "Like AppendQuoteRune, with non-ASCII runes escaped.", "dst = strconv.AppendQuoteRuneToASCII(dst, '世')"),
  symbol("strconv.AppendQuoteRuneToGraphic", "func AppendQuoteRuneToGraphic(dst []byte, r rune) []byte", "เหมือน AppendQuoteRune แต่ escape ตัวที่พิมพ์ไม่ได้", "Like AppendQuoteRune, escaping non-graphic runes.", "dst = strconv.AppendQuoteRuneToGraphic(dst, '\\n')"),
  symbol("strconv.AppendQuoteToASCII", "func AppendQuoteToASCII(dst []byte, s string) []byte", "เหมือน AppendQuote แต่ผลลัพธ์เป็น ASCII", "Like AppendQuote, with a result that is ASCII.", `dst = strconv.AppendQuoteToASCII(dst, "โลก")`),
  symbol("strconv.AppendQuoteToGraphic", "func AppendQuoteToGraphic(dst []byte, s string) []byte", "เหมือน AppendQuote แต่ escape ตัวที่พิมพ์ไม่ได้", "Like AppendQuote, escaping non-graphic characters.", `dst = strconv.AppendQuoteToGraphic(dst, "a\\nb")`),
  symbol("strconv.AppendUint", "func AppendUint(dst []byte, i uint64, base int) []byte", "ต่อจำนวนเต็มไม่ติดลบในฐาน base ท้าย dst", "Append an unsigned integer in the given base to dst.", "dst = strconv.AppendUint(dst, 255, 16)"),
  symbol("strconv.Atoi", "func Atoi(s string) (int, error)", "แปลงสตริงฐานสิบเป็น int", "Convert a decimal string to int.", `i, err := strconv.Atoi("-42")`),
  symbol("strconv.CanBackquote", "func CanBackquote(s string) bool", "ตรวจว่าใส่ s ใน raw string ได้โดยไม่ต้อง escape", "Report whether s can sit unchanged inside a raw string.", `strconv.CanBackquote("hello")`),
  symbol("strconv.FormatBool", "func FormatBool(b bool) string", `แปลง bool เป็น "true" หรือ "false"`, "Convert a bool to true or false.", "s := strconv.FormatBool(true)"),
  symbol("strconv.FormatComplex", "func FormatComplex(c complex128, fmt byte, prec, bitSize int) string", "แปลงจำนวนเชิงซ้อนเป็นสตริง", "Convert a complex number to a string.", "s := strconv.FormatComplex(1+2i, 'f', -1, 128)"),
  symbol("strconv.FormatFloat", "func FormatFloat(f float64, fmt byte, prec, bitSize int) string", "แปลงทศนิยมเป็นสตริง fmt เป็นรูปแบบ prec เป็นจำนวนหลัก bitSize เป็น 32 หรือ 64", "Convert a float to a string. fmt picks the format, prec the precision, bitSize 32 or 64.", "s := strconv.FormatFloat(3.1415, 'f', 2, 64)"),
  symbol("strconv.FormatInt", "func FormatInt(i int64, base int) string", "แปลงจำนวนเต็มเป็นสตริงในฐาน 2 ถึง 36", "Convert an integer to a string in base 2 through 36.", "s := strconv.FormatInt(-42, 16)"),
  symbol("strconv.FormatUint", "func FormatUint(i uint64, base int) string", "แปลงจำนวนเต็มไม่ติดลบเป็นสตริงในฐาน 2 ถึง 36", "Convert an unsigned integer to a string in base 2 through 36.", "s := strconv.FormatUint(42, 16)"),
  symbol("strconv.IsGraphic", "func IsGraphic(r rune) bool", "ตรวจว่า rune เป็นอักขระที่มองเห็นได้ตาม Unicode", "Report whether r is a Unicode graphic character.", "strconv.IsGraphic('A')"),
  symbol("strconv.IsPrint", "func IsPrint(r rune) bool", "ตรวจว่า rune พิมพ์ได้ตามกฎของ Go", "Report whether r is printable by Go's rules.", "strconv.IsPrint('A')"),
  symbol("strconv.Itoa", "func Itoa(i int) string", "แปลง int ฐานสิบเป็นสตริง", "Convert an int to a decimal string.", "s := strconv.Itoa(-42)"),
  symbol("strconv.NumError", "type NumError struct", "error จาก Parse ที่บอกชื่อฟังก์ชัน ข้อความต้นทาง และสาเหตุ", "Error from a Parse function, with the function name, the input, and the cause.", "var ne *strconv.NumError\nerrors.As(err, &ne)", KIND_TYPE),
  symbol("strconv.ParseBool", "func ParseBool(str string) (bool, error)", `รับ 1 t T true TRUE True เป็น true และ 0 f F false FALSE False เป็น false`, "Accept 1, t, T, true, TRUE, True as true, and 0, f, F, false, FALSE, False as false.", `b, err := strconv.ParseBool("true")`),
  symbol("strconv.ParseComplex", "func ParseComplex(s string, bitSize int) (complex128, error)", "แปลงสตริงเป็นจำนวนเชิงซ้อน bitSize เป็น 64 หรือ 128", "Convert a string to a complex number. bitSize is 64 or 128.", `c, err := strconv.ParseComplex("1+2i", 128)`),
  symbol("strconv.ParseFloat", "func ParseFloat(s string, bitSize int) (float64, error)", "แปลงสตริงเป็นทศนิยม bitSize เป็น 32 หรือ 64", "Convert a string to a float. bitSize is 32 or 64.", `f, err := strconv.ParseFloat("3.14", 64)`),
  symbol("strconv.ParseInt", "func ParseInt(s string, base int, bitSize int) (int64, error)", "แปลงสตริงเป็นจำนวนเต็ม ฐาน 0 หรือ 2–36 และ bitSize 0–64", "Convert a string to an integer. base is 0 or 2–36, bitSize is 0–64.", `i, err := strconv.ParseInt("-42", 10, 64)`),
  symbol("strconv.ParseUint", "func ParseUint(s string, base int, bitSize int) (uint64, error)", "แปลงสตริงเป็นจำนวนเต็มไม่ติดลบ", "Convert a string to an unsigned integer.", `u, err := strconv.ParseUint("42", 10, 64)`),
  symbol("strconv.Quote", "func Quote(s string) string", "ครอบ s ด้วยเครื่องหมายคำพูดแบบ Go string literal", "Wrap s as a double-quoted Go string literal.", `q := strconv.Quote("hi")`),
  symbol("strconv.QuoteRune", "func QuoteRune(r rune) string", "ครอบ rune ด้วยเครื่องหมายคำพูดเดี่ยว", "Wrap r as a single-quoted Go rune literal.", "q := strconv.QuoteRune('A')"),
  symbol("strconv.QuoteRuneToASCII", "func QuoteRuneToASCII(r rune) string", "เหมือน QuoteRune แต่ตัวที่ไม่ใช่ ASCII ถูก escape", "Like QuoteRune, with non-ASCII runes escaped.", "q := strconv.QuoteRuneToASCII('世')"),
  symbol("strconv.QuoteRuneToGraphic", "func QuoteRuneToGraphic(r rune) string", "เหมือน QuoteRune แต่ escape ตัวที่พิมพ์ไม่ได้", "Like QuoteRune, escaping non-graphic runes.", "q := strconv.QuoteRuneToGraphic('\\n')"),
  symbol("strconv.QuoteToASCII", "func QuoteToASCII(s string) string", "เหมือน Quote แต่ผลลัพธ์เป็น ASCII", "Like Quote, with a result that is ASCII.", `q := strconv.QuoteToASCII("โลก")`),
  symbol("strconv.QuoteToGraphic", "func QuoteToGraphic(s string) string", "เหมือน Quote แต่ escape ตัวที่พิมพ์ไม่ได้", "Like Quote, escaping non-graphic characters.", `q := strconv.QuoteToGraphic("a\\nb")`),
  symbol("strconv.QuotedPrefix", "func QuotedPrefix(s string) (string, error)", "อ่าน quoted string จากต้น s แม้ด้านหลังจะมีข้อความต่อ", "Read a quoted string from the start of s, even if more text follows.", "q, err := strconv.QuotedPrefix(`\"hi\" rest`)"),
  symbol("strconv.Unquote", "func Unquote(s string) (string, error)", "ถอดเครื่องหมายคำพูดของ string หรือ rune literal", "Unquote a Go string or rune literal.", "s, err := strconv.Unquote(`\"hi\"`)"),
  symbol("strconv.UnquoteChar", "func UnquoteChar(s string, quote byte) (value rune, multibyte bool, tail string, err error)", "ถอดอักขระหรือ escape ตัวแรกใน s แล้วคืนส่วนที่เหลือ", "Decode the first character or escape in s, and return the rest.", `r, _, tail, err := strconv.UnquoteChar("\\n", '"')`),
  symbol("slices.Contains", "func Contains(s []E, v E) bool", "ตรวจว่าสไลซ์มีค่านี้หรือไม่", "Report whether the slice contains v.", "slices.Contains([]int{1, 2}, 2)"),
  symbol("slices.Sort", "func Sort(x []E)", "เรียงสไลซ์จากน้อยไปมาก", "Sort the slice in ascending order.", "slices.Sort([]int{3, 1, 2})"),
  symbol("make", "func make(t Type, size ...IntegerType) Type", "สร้าง slice, map หรือ channel", "Create a slice, map, or channel.", "s := make([]int, 0, 8)"),
  symbol("len", "func len(v Type) int", "คืนจำนวนสมาชิกหรือความยาว", "Return the length of a string, slice, map, or channel.", `n := len("hi")`),
  symbol("cap", "func cap(v Type) int", "คืนความจุของ slice, array หรือ channel", "Return the capacity of a slice, array, or channel.", "c := cap(buf)"),
  symbol("append", "func append(slice []Type, elems ...Type) []Type", "เติมค่าท้าย slice แล้วคืน slice ที่อาจตัวใหม่", "Append elements and return the resulting slice.", "s = append(s, 1, 2)"),
  symbol("copy", "func copy(dst, src []Type) int", "คัดลอกสมาชิกจาก src ไป dst แล้วคืนจำนวนที่คัดลอก", "Copy elements from src to dst and return how many were copied.", "n := copy(dst, src)"),
  symbol("delete", "func delete(m map[Type]Type1, key Type)", "ลบคีย์ออกจาก map", "Remove a key from a map.", `delete(m, "id")`),
  symbol("panic", "func panic(v any)", "หยุดการทำงานทันที และส่งค่าให้ recover", "Stop the goroutine and pass v to recover.", `panic("unreachable")`),
  symbol("recover", "func recover() any", "จับค่าจาก panic ใน deferred function คืน nil ถ้าไม่มี panic", "Catch a panic inside a deferred function. Returns nil when nothing panicked.", "if v := recover(); v != nil {}"),
  symbol("close", "func close(c chan<- Type)", "ปิด channel ไม่ให้ส่งค่าเพิ่ม", "Close a channel so no more values can be sent.", "close(done)"),
];

const generatedSymbols = generatedFile as GoSymbol[];
const curatedByName = new Map(curatedSymbols.map((item) => [item.name, item]));
const generatedNames = new Set(generatedSymbols.map((item) => item.name));

export const GO_SYMBOLS: GoSymbol[] = [
  ...generatedSymbols.map((item) => curatedByName.get(item.name) ?? item),
  ...curatedSymbols.filter((item) => !generatedNames.has(item.name)),
].sort((left, right) => left.name.localeCompare(right.name));
