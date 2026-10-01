## explanation
แพ็กเกจคือแฟ้มที่รวมไฟล์ `.go` เรื่องเดียวกันไว้ในโฟลเดอร์เดียว ทุกไฟล์ในโฟลเดอร์นั้นขึ้นต้นด้วย `package ชื่อเดียวกัน` ส่วนโมดูลคือทั้งโปรเจกต์ มีไฟล์ `go.mod` อยู่ที่โฟลเดอร์บนสุด

```
module example.com/shop

go 1.25
```

- `module example.com/shop` คือชื่อโมดูล ใช้เป็นต้นทางของ path ตอน import
- `go 1.25` คือรุ่นของภาษา Go ที่โปรเจกต์นี้ใช้

ถ้ามีแพ็กเกจอยู่ในโฟลเดอร์ `price` ของโมดูลนี้ จะ import ด้วย path `"example.com/shop/price"` แล้วเรียกด้วยชื่อแพ็กเกจนำหน้า เช่น `price.Total(...)`

## apply
ชื่อที่ขึ้นต้นด้วยตัวพิมพ์ใหญ่ถูก export หมายถึงแพ็กเกจอื่นเรียกใช้ได้ ส่วนชื่อที่ขึ้นต้นด้วยตัวพิมพ์เล็กใช้ได้แค่ในแพ็กเกจเดียวกัน

```
package price

func Total(a, b int) int {
	return a + b + fee()
}

func fee() int {
	return 5
}
```

แพ็กเกจอื่นเรียก `price.Total(10, 20)` ได้ แต่เรียก `price.fee()` ไม่ได้ เพราะ fee ขึ้นต้นด้วยตัวพิมพ์เล็ก

แพ็กเกจมาตรฐานที่มากับ Go ก็ใช้แบบเดียวกัน เช่น `fmt.Println` ขึ้นต้นด้วย P ใหญ่ และ import ด้วยชื่อสั้น ๆ อย่าง `"fmt"` หรือ `"strings"` โดยไม่ต้องมีชื่อโมดูลนำหน้า

## easy
ตัวอย่าง: ใช้แพ็กเกจ strings เช็กว่าข้อความขึ้นต้นด้วยคำที่ต้องการไหม

```
import "strings"

func IsGreeting(s string) bool {
	return strings.HasPrefix(s, "hello")
}
```

`IsGreeting("hello there")` ได้ true ไม่ต้องเขียนลูปเทียบตัวอักษรเอง เพราะแพ็กเกจ strings มีฟังก์ชันนี้อยู่แล้ว

## hard
ตัวอย่าง: import สองแพ็กเกจพร้อมกัน ใส่ไว้ในวงเล็บเดียวกัน

```
import (
	"strconv"
	"strings"
)

func Tag(name string, n int) string {
	return strings.ToLower(name) + "-" + strconv.Itoa(n)
}
```

`Tag("Tea", 3)` ได้ `tea-3` โดย `strconv.Itoa` แปลงตัวเลขเป็นข้อความ ซึ่งเป็นงานกลับด้านของ `strconv.Atoi`
