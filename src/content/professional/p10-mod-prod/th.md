## explanation
บรรทัด go ใน go.mod บอกรุ่นภาษาที่โมดูลนี้ใช้ อย่างน้อยรุ่นนั้น go 1.25 แปลว่าโมดูลนี้ใช้ภาษาอย่างน้อยรุ่น 1.25

```
module example.com/app

go 1.25
```

## apply
บรรทัด toolchain ขอชุดเครื่องมือรุ่นนั้น เช่น ตัวคอมไพเลอร์ ส่วนบรรทัด go บอกรุ่นภาษา สองบรรทัดไม่ใช่สิ่งเดียวกัน GOTOOLCHAIN=local สั่งให้ใช้ toolchain ที่ติดตั้งอยู่ และไม่ดาวน์โหลด toolchain อื่น

```
module example.com/app

go 1.25

toolchain go1.25.0
```

```
GOTOOLCHAIN=local go test ./...
```

คำสั่งนี้รันเทสต์ด้วย Go ที่ติดตั้งในเครื่อง ไม่ไปโหลดชุดเครื่องมือชุดใหม่

## easy
บรรทัด go 1.25 บอกว่าโมดูลนี้ใช้ภาษาอย่างน้อยรุ่น 1.25

```
go 1.25
```

## hard
GOTOOLCHAIN=local ใช้ toolchain ที่ติดตั้งอยู่และไม่ดาวน์โหลด toolchain อื่น บรรทัด toolchain ขอชุดเครื่องมือรุ่นนั้น ส่วนบรรทัด go บอกรุ่นภาษา

```
GOTOOLCHAIN=local go test ./...
```

```
go 1.25

toolchain go1.25.0
```
