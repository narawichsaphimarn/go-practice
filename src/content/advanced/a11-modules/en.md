## explanation
The module line in go.mod is this module's path. The go line is the language version. A require line is another module you need. An import whose path is not under this module path is outside. A go.work file is for developing several modules on one machine and does not replace go.mod.

```
module example.com/app

go 1.25
```

## apply
Use it when splitting a service into modules or when editing local code that is not published yet.

## easy
What require means.

## hard
What sits outside the module, and what go.work does.

## steps
- Read the module line
- Check whether an import is under that path
- Do not confuse go.work with go.mod
- Answer on this page without sending code to the runner
