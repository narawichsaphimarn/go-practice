## explanation
greenteagc คือตัวเก็บขยะแบบทดลอง มันยังไม่ใช่ตัวเก็บขยะปกติ ต้องเปิดเองด้วยตัวแปรสภาพแวดล้อม GOEXPERIMENT=greenteagc

```
GOEXPERIMENT=greenteagc go run .
```

คำสั่งนี้รันโปรแกรมด้วยตัวเก็บขยะทดลองตามกติกาของ experiment

## apply
มันยังไม่ใช่ค่าเริ่มต้นเพราะยังต้องวัดผลในงานจริงก่อนแทนที่ตัวเก็บขยะปกติ โปรแกรมที่ไม่ตั้งตัวแปรนี้ยังใช้ตัวเก็บขยะเดิม

```
package main

import "fmt"

func main() {
	fmt.Println("ordinary collector unless GOEXPERIMENT=greenteagc")
}
```

## easy
greenteagc คือตัวเก็บขยะแบบทดลองที่ต้องเปิดด้วย GOEXPERIMENT

```
GOEXPERIMENT=greenteagc go run .
```

## hard
เปิดด้วย GOEXPERIMENT=greenteagc ตอน build หรือรัน มันยังไม่ใช่ค่าเริ่มต้นเพราะยังต้องวัดผลในงานจริง

```
GOEXPERIMENT=greenteagc go test ./...
```
