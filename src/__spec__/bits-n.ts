import '../lib/test-env.js'
import { BitsN } from '../lib/bits-n'

const TestBits = new BitsN(['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const, {
  a_c: ['a', 'b', 'c']
})
const ShowBits = new BitsN(
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
  // expect(TestBits).toMatchSnapshot()
  expect(TestBits.labels).toEqual(TestBits.by(testValue))

  // expect(testBits).toMatchSnapshot()
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
  // expect(ShowBits).toMatchSnapshot()
  expect(ShowBits.labels).toEqual(ShowBits.by(testValue))

  // expect(testBits).toMatchSnapshot()
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
  expect(true).toEqual(BitsN.isSingle(0b100000n))
  expect(false).toEqual(BitsN.isSingle(0b100100n))
  expect(0b01100).toEqual(BitsN.firstOff(0b01110n))
  expect(0b01110).toEqual(BitsN.firstOff(0b01111n))
  expect(0b01101).toEqual(BitsN.firstOn(0b01100n))
  expect(0b00111).toEqual(BitsN.firstOn(0b00011n))
  expect(0b00010).toEqual(BitsN.findBitOn(0b01110n))
  expect(0b00010).toEqual(BitsN.findBitOn(0b11110n))
  expect(0b00001).toEqual(BitsN.findBitOff(0b01100n))
  expect(0b00100).toEqual(BitsN.findBitOff(0b10011n))
  expect(0b01111).toEqual(BitsN.fillHeadsToOn(0b01100n))
  expect(0b10011).toEqual(BitsN.fillHeadsToOn(0b10011n))
  expect(0b01100).toEqual(BitsN.fillHeadsToOff(0b01100n))
  expect(0b10000).toEqual(BitsN.fillHeadsToOff(0b10011n))
  expect(0b00000).toEqual(BitsN.headsBitOn(0b01100n))
  expect(0b00011).toEqual(BitsN.headsBitOn(0b10011n))
  expect(0b00011).toEqual(BitsN.headsBitOff(0b01100n))
  expect(0b00000).toEqual(BitsN.headsBitOff(0b10011n))
  expect(0b00111).toEqual(BitsN.headsBitOffAndNextOn(0b01100n))
  expect(0b00001).toEqual(BitsN.headsBitOffAndNextOn(0b10011n))

  expect(0b00010).toEqual(BitsN.snoob(0b00001n))
  expect(0b00110).toEqual(BitsN.snoob(0b00101n))

  expect(4).toEqual(BitsN.count(0b110110n))
  expect(3).toEqual(BitsN.count(0b101100n))
  expect(2).toEqual(BitsN.count(0b000110n))
})
