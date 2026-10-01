## explanation
ฟังก์ชันในแพ็กเกจเดียวกันเรียกกันได้โดยใช้ชื่อฟังก์ชันตรงๆ go.mod ของโมดูลบอกชื่อโมดูลกับรุ่น Go

```
module example.com/app

go 1.25
```

```
package main

func Greet(name string) string {
	return "hello " + name
}
```

ผู้เรียกในแพ็กเกจ main เขียน Greet("ann") แล้วได้ hello ann

## apply
ข้อความทักทาย ข้อความที่ต่อสองชิ้นด้วยจุลภาค และข้อความรุ่นโปรแกรม เป็นฟังก์ชันคนละตัวในแพ็กเกจเดียวกัน จึงเรียกซ้ำได้โดยไม่ก็อปข้อความ

## easy
Greet คืนคำว่า hello เว้นวรรค แล้วตามด้วยชื่อ

```
func Greet(name string) string {
	return "hello " + name
}
```

## hard
Version คืนสตริง 1.25 Join ต่อ a กับ b โดยคั่นด้วยจุลภาค

```
func Version() string {
	return "1.25"
}
```

```
func Join(a, b string) string {
	return a + "," + b
}
```
