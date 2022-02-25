### number

console.log(
ヒンディー test.stringify(123, 'वाँ'),
ヒンディー test.stringify(12345, 'वाँ'),
ヒンディー test.stringify(1234567, 'वाँ'),
ヒンディー test.stringify(123456789, 'वाँ'),
ヒンディー test.stringify(12345678901, 'वाँ'),
ヒンディー test.stringify(1234567890000, 'वाँ')
)

console.log(
एक.stringify(123, 'वाँ'),
एक.stringify(12345, 'वाँ'),
एक.stringify(1234567, 'वाँ'),
एक.stringify(123456789, 'वाँ'),
एक.stringify(12345678901, 'वाँ'),
एक.stringify(1234567890000, 'वाँ')
)

console.log(
漢字.parse('二十三億四百五十六'),
漢字.parse('九千兆六百万'),
漢字.parse('千百十'),
漢字.stringify(0.1234567, '個'),
漢字.stringify(12345678901, '個'),
漢字.stringify(1234567890000, '個')
)
console.log(
大字.parse('弐分参厘肆毛伍糸陸忽漆微'),
大字.parse('佰弐拾参億肆阡伍佰陸拾漆萬捌阡玖佰壱個'),
大字.parse('壱兆弐阡参佰肆拾伍億陸阡漆佰捌拾玖萬個'),
大字.stringify(1.234567, '個'),
大字.stringify(12345678901, '個'),
大字.stringify(1234567890000, '個')
)
console.log(
よみ.stringify(1.234567, 'こ'),
よみ.stringify(12345678901, 'こ'),
よみ.stringify(1234567890000, 'こ')
)
console.log(
こてん.stringify(1.234567, 'か'),
こてん.stringify(12345678901, 'か'),
こてん.stringify(1234567890000, 'か')
)
console.log(
こてん.stringify(1.234567, 'つ'),
こてん.stringify(12345678901, 'つ'),
こてん.stringify(1234567890000, 'つ')
)
console.log(
angle.stringify(0.01, ''),
angle.stringify(0.03, ''),
angle.stringify(0.05, ''),
angle.stringify(0.6, ''),
angle.stringify(0.8, ''),
angle.stringify(1.0, '')
)
