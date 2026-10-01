## explanation
การต่อ host กับ port ด้วยสตริงพังเมื่อ host เป็น IPv6 เพราะต้องมีวงเล็บ net.JoinHostPort จัดการให้ ใน Go 1.25 บล็อก ignore ใน go.mod บอกไดเรกทอรีที่คำสั่ง go จะไม่เข้าไปดู

```
net.JoinHostPort("::1", "80")
```

## apply
ใช้ตอนประกอบที่อยู่สำหรับ dial และตอนกันโฟลเดอร์เครื่องมือออกจากแพ็กเกจที่ go test เดิน

## easy
ต่อ host กับ port ของ IPv4

## hard
ต่อ IPv6 ให้ถูก และตอบว่า ignore ทำอะไร

## steps
- อย่าต่อ host:port เอง
- ใช้ JoinHostPort
- จำว่า IPv6 ต้องมีวงเล็บ
- ตอบข้อ ignore ในหน้าบท
