## explanation
channel ที่ไม่มี buffer จะให้ผู้ส่งรอจนกว่าจะมีผู้รับ channel ที่มี buffer รับค่าได้เท่าความจุ การ close บอกว่าจะไม่มีค่าใหม่ และ range จะจบเมื่อ channel ถูกปิด

```
ch := make(chan int, 1)
ch <- 1
fmt.Println(<-ch)
```

## apply
ใช้ส่งงานเข้า worker และส่งผลกลับโดยไม่แชร์ตัวแปรตรงๆ

## easy
ส่งแล้วรับค่าเดียว

## hard
รวมค่าจาก channel ที่ถูกปิด

## steps
- เลือก buffer ให้พอ หรือมีผู้รับรออยู่
- ปิด channel ที่ฝั่งผู้ส่ง
- ใช้ range หลังปิด
- อย่าส่งเข้า channel ที่ปิดแล้ว
