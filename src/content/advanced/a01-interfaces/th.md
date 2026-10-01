## explanation
interface คือสัญญาว่าต้องทำอะไรได้ ไม่ได้บอกว่าของนั้นเป็นหมาหรือแมว Speaker สัญญาว่ามี Speak ที่คืนข้อความ

```
type Speaker interface {
	Speak() string
}
```

สุนัขกับแมวคนละชนิด แต่ทั้งคู่ทำให้สัญญาสำเร็จได้

```
type Dog struct{}

func (Dog) Speak() string { return "woof" }

type Cat struct{}

func (Cat) Speak() string { return "meow" }
```

## apply
คนประกาศบนเวทีไม่ต้องรู้ว่าตัวไหนเป็นหมาหรือแมว เขาแค่ขอให้ส่งเสียง หมาตอบ woof แมวตอบ meow ฟังก์ชัน Announce คือคนประกาศ มันรับ Speaker แล้วเรียก Speak

```
func Announce(s Speaker) string {
	return s.Speak()
}

fmt.Println(Announce(Dog{}))
fmt.Println(Announce(Cat{}))
```

ได้ woof แล้ว meow จากฟังก์ชันเดียวกัน

## easy
ทำให้สุนัขส่งเสียงได้ โดยให้ Speak ของ Dog คืน woof

```
type Dog struct{}

func (Dog) Speak() string {
	return "woof"
}
```

## hard
Announce ไม่รับ Dog โดยตรง แต่รับ Speaker จึงใส่ได้ทั้ง Dog และ Cat แมวต้องมี Speak ที่คืน meow ด้วย ไม่งั้นยังส่งเข้า Announce ไม่ได้

```
type Speaker interface {
	Speak() string
}

type Dog struct{}

func (Dog) Speak() string { return "woof" }

type Cat struct{}

func (Cat) Speak() string { return "meow" }

func Announce(s Speaker) string {
	return s.Speak()
}
```
