## explanation
GOMAXPROCS คือจำนวนเธรดที่ Go ใช้รัน goroutine พร้อมกัน ตั้งแต่ Go 1.25 บน Linux ถ้ามีลิมิต CPU ของ cgroup ค่าเริ่มต้นของ GOMAXPROCS มาจากลิมิตนั้น

```
func show() int {
	return runtime.GOMAXPROCS(0)
}
```

runtime.GOMAXPROCS(0) คืนค่าปัจจุบันโดยไม่เปลี่ยน ต้อง import "runtime"

## apply
ถ้าตั้ง GOMAXPROCS เอง ค่านั้นชนะค่าที่ปรับจาก cgroup พฤติกรรมนี้ใช้บน Linux เมื่อมีลิมิตของ cgroup ไม่ใช่ทุกแพลตฟอร์ม

```
runtime.GOMAXPROCS(2)
```

หลังบรรทัดนี้โปรแกรมใช้ 2 แม้ cgroup จะอนุญาตมากกว่า

## easy
บน Linux Go 1.25 ใช้ลิมิต CPU ของ cgroup เป็นค่าเริ่มต้นของ GOMAXPROCS เมื่อมีลิมิตนั้น

```
func show() int {
	return runtime.GOMAXPROCS(0)
}
```

## hard
พฤติกรรมนี้ใช้บน Linux เมื่อมีลิมิตของ cgroup ถ้าตั้ง GOMAXPROCS เอง ค่าที่ตั้งเองชนะค่าที่ปรับจาก cgroup

```
runtime.GOMAXPROCS(2)
```
