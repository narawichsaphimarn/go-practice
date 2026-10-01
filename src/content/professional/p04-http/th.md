## explanation
handler ควรปฏิเสธ method ที่ไม่รองรับด้วย 405 client ควรมี Timeout เพื่อไม่ให้คำขอแขวน httptest.NewRequest สร้าง request ในเทสต์โดยไม่ต้องเปิดพอร์ต

```
if r.Method != http.MethodPost {
	return http.StatusMethodNotAllowed
}
```

## apply
ใช้ทั้งตอนเขียน API เล็กๆ และตอนเรียก service อื่นจาก backend

## easy
รับเฉพาะ POST

## hard
ตั้ง timeout ให้ client หรือเขียนสถานะลง ResponseWriter

## steps
- เทียบ r.Method กับค่าคงที่ของ http
- คืน 405 เมื่อ method ไม่ถูก
- ตั้ง Client.Timeout
- ใช้ httptest ในเทสต์ ไม่เปิดพอร์ตจริง
