import '../lib/test-env.js'
import { Bits } from '../lib/bits'

const TestBits = new Bits(['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const, {
  a_c: ['a', 'b', 'c']
})
const ShowBits = new Bits(
  [
    'pin',
    'toc',
    'toc',
    'potof',
    'current',
    'search',
    'magnify',
    'side',
    'link',
    'mention'
  ] as const,
  {}
)

test('basic value', () => {
  const testValue = TestBits.by(TestBits.labels)
  const testBits = TestBits.data(testValue)
  expect(TestBits).toMatchSnapshot()
  expect(TestBits.labels).toEqual(TestBits.by(testValue))

  expect(testBits).toMatchSnapshot()
  expect(testBits.is.g).toEqual(true)
  expect(testBits.is.f).toEqual(true)
  expect(testBits.is.e).toEqual(true)
  expect(testBits.is.d).toEqual(true)
  expect(testBits.is.c).toEqual(true)
  expect(testBits.is.b).toEqual(true)
  expect(testBits.is.a).toEqual(true)
  expect(testBits.has.g).toEqual(64)
  expect(testBits.has.f).toEqual(32)
  expect(testBits.has.e).toEqual(16)
  expect(testBits.has.d).toEqual(8)
  expect(testBits.has.c).toEqual(4)
  expect(testBits.has.b).toEqual(2)
  expect(testBits.has.a).toEqual(1)
})

test('showlabel value', () => {
  const testValue = ShowBits.by(ShowBits.labels)
  const testBits = ShowBits.data(testValue)
  expect(ShowBits).toMatchSnapshot()
  expect(ShowBits.labels).toEqual(ShowBits.by(testValue))

  expect(testBits).toMatchSnapshot()
  expect(testBits.is.pin).toEqual(true)
  expect(testBits.is.toc).toEqual(true)
  expect(testBits.is.potof).toEqual(true)
  expect(testBits.is.current).toEqual(true)
  expect(testBits.is.search).toEqual(true)
  expect(testBits.is.magnify).toEqual(true)
  expect(testBits.is.side).toEqual(true)
  expect(testBits.is.link).toEqual(true)
  expect(testBits.is.mention).toEqual(true)
  expect((testBits.is as any).other).toEqual(false)
  expect(testBits.has.pin).toEqual(1)
  expect(testBits.has.toc).toEqual(6)
  expect(testBits.has.potof).toEqual(8)
  expect(testBits.has.current).toEqual(16)
  expect(testBits.has.search).toEqual(32)
  expect(testBits.has.magnify).toEqual(64)
  expect(testBits.has.side).toEqual(128)
  expect(testBits.has.link).toEqual(256)
  expect(testBits.has.mention).toEqual(512)
  expect((testBits.has as any).other).toEqual(0)
})

test('field calc', () => {
  expect(true).toEqual(Bits.isSingle(0b100000))
  expect(false).toEqual(Bits.isSingle(0b100100))
  expect(0b01100).toEqual(Bits.firstOff(0b01110))
  expect(0b01110).toEqual(Bits.firstOff(0b01111))
  expect(0b01101).toEqual(Bits.firstOn(0b01100))
  expect(0b00111).toEqual(Bits.firstOn(0b00011))
  expect(0b00010).toEqual(Bits.findBitOn(0b01110))
  expect(0b00010).toEqual(Bits.findBitOn(0b11110))
  expect(0b00001).toEqual(Bits.findBitOff(0b01100))
  expect(0b00100).toEqual(Bits.findBitOff(0b10011))
  expect(0b01111).toEqual(Bits.fillHeadsToOn(0b01100))
  expect(0b10011).toEqual(Bits.fillHeadsToOn(0b10011))
  expect(0b01100).toEqual(Bits.fillHeadsToOff(0b01100))
  expect(0b10000).toEqual(Bits.fillHeadsToOff(0b10011))
  expect(0b00000).toEqual(Bits.headsBitOn(0b01100))
  expect(0b00011).toEqual(Bits.headsBitOn(0b10011))
  expect(0b00011).toEqual(Bits.headsBitOff(0b01100))
  expect(0b00000).toEqual(Bits.headsBitOff(0b10011))
  expect(0b00111).toEqual(Bits.headsBitOffAndNextOn(0b01100))
  expect(0b00001).toEqual(Bits.headsBitOffAndNextOn(0b10011))

  expect(0b00010).toEqual(Bits.snoob(0b00001))
  expect(0b00110).toEqual(Bits.snoob(0b00101))

  expect(4).toEqual(Bits.count(0b110110))
  expect(3).toEqual(Bits.count(0b101100))
  expect(2).toEqual(Bits.count(0b000110))
})
