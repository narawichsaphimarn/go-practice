## explanation
ที่อยู่เครือข่ายคือโฮสต์กับพอร์ต net.JoinHostPort ประกอบสองส่วนนั้นให้ถูกทั้ง IPv4 และ IPv6 Host ใช้กับ 127.0.0.1 พอร์ต 8080

```
func Host() string {
	return net.JoinHostPort("127.0.0.1", "8080")
}
```

Host() ได้ "127.0.0.1:8080" ต้อง import "net"

## apply
ที่อยู่ IPv6 ต้องมีวงเล็บครอบก่อนพอร์ต ไม่งั้นเครื่องอ่านไม่ออกว่าพอร์ตอยู่ตรงไหน V6 ใช้ JoinHostPort กับ ::1 และ 80 แล้วได้ "[::1]:80" บล็อก ignore ใน go.mod ของ Go 1.25 บอกให้คำสั่ง go ข้ามไดเรกทอรีที่ระบุ และไม่ถือว่าเป็นแพ็กเกจในโมดูล

```
func V6() string {
	return net.JoinHostPort("::1", "80")
}
```

```
ignore (
	./tmp
	./scratch
)
```

คำสั่ง go จะไม่คอมไพล์แพ็กเกจในโฟลเดอร์ tmp และ scratch

## easy
Host คืน net.JoinHostPort ของ 127.0.0.1 และ 8080

```
func Host() string {
	return net.JoinHostPort("127.0.0.1", "8080")
}
```

## hard
บล็อก ignore ใน go.mod ทำให้คำสั่ง go ข้ามไดเรกทอรีที่ระบุ V6 คืนที่อยู่ของ ::1 พอร์ต 80 พร้อมวงเล็บ

```
ignore (
	./tmp
)
```

```
func V6() string {
	return net.JoinHostPort("::1", "80")
}
```
