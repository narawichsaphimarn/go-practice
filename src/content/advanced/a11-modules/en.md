## explanation
A module is one Go project, with a `go.mod` file in its top folder. Think of go.mod as the project's identity card.

```
module example.com/app

go 1.25

require golang.org/x/mod v0.21.0
```

- `module` is the module name and the start of every import path in the project.
- `go` is the language version the project uses.
- `require` lists another module the project uses, with its version.

Go also writes a `go.sum` file with checksums of the downloaded modules, to detect code that was changed on the way. Commit it together with go.mod.

## apply
To tell whether an import is inside or outside the module, check whether the path starts with the module name.

```
import "example.com/app/internal/web"
import "golang.org/x/mod/semver"
```

The first is inside the module example.com/app. The second comes from another module, so go.mod needs a require for it.

Commands you will use often:

- `go mod tidy` reads every import in the code, adds missing requires, and removes unused ones.
- `go get golang.org/x/mod@v0.22.0` changes the version of a module you use.

When you edit several modules on your machine at once, a `go.work` file points at each module's folder. go.work is only for development and does not replace go.mod; each module keeps its own go.mod.

```
go 1.25

use ./app
use ./lib
```

## easy
Example: read the go.mod of an online shop.

```
module shop.example.com/api

go 1.25

require github.com/google/uuid v1.6.0
```

The module is named `shop.example.com/api`, uses Go 1.25, and uses the module `github.com/google/uuid` at version v1.6.0.

## hard
Example: the same module has the folders `internal/order` and `cmd/server`.

```
import "shop.example.com/api/internal/order"
import "github.com/google/uuid"
```

The first is inside the module because it starts with `shop.example.com/api`, and the folder name internal means only code in this module may import it. The second belongs to another module and needs a require in go.mod.
