## explanation
greenteagc คือตัวเก็บขยะแบบทดลอง มันยังไม่ใช่ตัวเก็บขยะปกติ ต้องเปิดเองด้วยตัวแปรสภาพแวดล้อม GOEXPERIMENT=greenteagc

```
GOEXPERIMENT=greenteagc go run .
```

คำสั่งนี้รันโปรแกรมด้วยตัวเก็บขยะทดลองตามกติกาของ experiment บทนี้อิง Go 1.25 ที่ใช้ตรวจโจทย์ ตั้งแต่ Go 1.26 greenteagc เป็นค่าเริ่มต้นแล้ว

## apply
ใน Go 1.25 ตัวเก็บขยะนี้ยังไม่ใช่ค่าเริ่มต้นเพราะยังต้องวัดผลในงานจริงก่อนแทนที่ตัวเก็บขยะปกติ โปรแกรมที่ไม่ตั้งตัวแปรนี้ยังใช้ตัวเก็บขยะเดิม

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
เปิดด้วย GOEXPERIMENT=greenteagc ตอน build (go run และ go test ก็ build ก่อนรัน) ใน Go 1.25 ยังไม่ใช่ค่าเริ่มต้นเพราะยังต้องวัดผลในงานจริง

```
GOEXPERIMENT=greenteagc go test ./...
```
