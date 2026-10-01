## explanation
go.mod is the module's identity card. The module line names the module. The go line states the language version. A require line records that this module needs another module at a given version.

```
module example.com/app

go 1.25

require golang.org/x/mod v0.21.0
```

require golang.org/x/mod v0.21.0 means this program uses the module golang.org/x/mod at version v0.21.0.

## apply
Something inside the module example.com/app is a path that starts with that name. Something outside is any other path, such as golang.org/x/mod. A go.work file groups modules on disk for local development and does not replace go.mod.

```
import "example.com/app/internal/web"
import "golang.org/x/mod"
```

The first import is inside example.com/app. The second import is outside the module.

```
go 1.25

use ./app
use ./tools
```

go.work points at the module folders you develop together. Each folder still has its own go.mod.

## easy
A require line in go.mod records that this module needs that module at the given version.

```
require golang.org/x/mod v0.21.0
```

## hard
go.work groups modules on disk so you can develop them together. An import outside example.com/app is a path that does not start with that module name, such as golang.org/x/mod.

```
go 1.25

use ./app
use ./tools
```

```
import "golang.org/x/mod"
```
