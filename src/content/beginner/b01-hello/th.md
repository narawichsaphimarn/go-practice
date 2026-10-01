## explanation
โปรแกรม Go เริ่มที่ฟังก์ชัน main และฟังก์ชันนั้นต้องอยู่ในแพ็กเกจชื่อ main ไฟล์ go.mod บอกว่าโฟลเดอร์นี้คือโมดูลหนึ่ง และใช้ภาษา Go รุ่น 1.25

```
package main

import "fmt"

func main() {
	fmt.Println("hello")
}
```

```
module example.com/hello

go 1.25
```

ในโฟลเดอร์ที่มีสองไฟล์นี้ คำสั่ง go run . จะคอมไพล์แล้วรัน main ให้เห็นคำว่า hello

## apply
เครื่องมือบรรทัดคำสั่งที่พิมพ์ผลแล้วจบ ใช้ main แบบนี้ ตัวอย่างคือสคริปต์ทักทายที่พิมพ์สองบรรทัดแล้วโปรแกรมจบเอง

```
package main

import "fmt"

func main() {
	fmt.Println("go")
	fmt.Println("1.25")
}
```

รันด้วย go run . จะได้

```
go
1.25
```

## easy
พิมพ์คำว่า hello หนึ่งบรรทัด Println เติมขึ้นบรรทัดใหม่ให้เอง

```
package main

import "fmt"

func main() {
	fmt.Println("hello")
}
```

## hard
พิมพ์ sum=3 โดยคำนวณ 1+2 แล้วประกอบกับข้อความ ไม่พิมพ์เลข 3 เป็นตัวหนังสือล้วน

```
package main

import "fmt"

func main() {
	fmt.Printf("sum=%d\n", 1+2)
}
```
