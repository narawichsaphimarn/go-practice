## explanation
greenteagc is an experimental garbage collector. It is not the ordinary collector. You turn it on with the environment variable GOEXPERIMENT=greenteagc.

```
GOEXPERIMENT=greenteagc go run .
```

This command runs the program with the experimental collector, following the experiment rules. This lesson follows Go 1.25, which checks the exercises. Since Go 1.26, greenteagc is the default.

## apply
In Go 1.25 it is not the default yet because it still needs measurement on real workloads before it replaces the ordinary collector. A program that does not set the variable still uses the ordinary collector.

```
package main

import "fmt"

func main() {
	fmt.Println("ordinary collector unless GOEXPERIMENT=greenteagc")
}
```

## easy
greenteagc is an experimental collector that you enable with GOEXPERIMENT.

```
GOEXPERIMENT=greenteagc go run .
```

## hard
Turn it on with GOEXPERIMENT=greenteagc at build time (go run and go test build first). In Go 1.25 it is not the default because it still needs measurement on real workloads.

```
GOEXPERIMENT=greenteagc go test ./...
```
