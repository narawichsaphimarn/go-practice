## explanation
if เลือกทำเมื่อเงื่อนไขเป็นจริง for ทำซ้ำตามจำนวนรอบ switch เลือกตามค่าของตัวแปรทีละกรณี

```
score := 80
if score >= 80 {
	fmt.Println("pass")
}
```

```
for i := 1; i <= 3; i++ {
	fmt.Print(i)
}
```

```
day := 1
switch day {
case 1:
	fmt.Println("monday")
}
```

## apply
ตรวจคะแนนสอบ ถ้าถึง 80 ให้พิมพ์ pass วนพิมพ์เลขข้อ 1 ถึง 3 ติดกันเป็น 123 และแปลงรหัสวันเป็นชื่อวัน

โค้ดสามก้อนด้านบนวางใน main ได้ทีละก้อน ผลของลูปคือ 123 โดยไม่มีช่องว่างเพราะใช้ Print ไม่ใช่ Println

## easy
ให้ score เป็น 80 แล้วพิมพ์ pass เมื่อ score มากกว่าหรือเท่ากับ 80

```
score := 80
if score >= 80 {
	fmt.Println("pass")
}
```

## hard
ให้ day เป็น 1 แล้วใช้ switch พิมพ์ monday เฉพาะกรณีนั้น

```
day := 1
switch day {
case 1:
	fmt.Println("monday")
}
```
