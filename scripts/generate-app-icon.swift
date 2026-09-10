import AppKit
let output = CommandLine.arguments[1]
let size = 1024
let image = NSImage(size: NSSize(width: size, height: size))
image.lockFocus()
NSColor(red: 0.15, green: 0.24, blue: 0.20, alpha: 1).setFill()
NSRect(x: 0, y: 0, width: size, height: size).fill()
let gold = NSColor(red: 0.82, green: 0.71, blue: 0.49, alpha: 1)
gold.setStroke()
let ring = NSBezierPath(ovalIn: NSRect(x: 110, y: 110, width: 804, height: 804))
ring.lineWidth = 5
ring.stroke()
let paragraph = NSMutableParagraphStyle()
paragraph.alignment = .center
let font = NSFont(name: "KohinoorDevanagari-Regular", size: 400) ?? NSFont.systemFont(ofSize: 400)
let text = NSAttributedString(string: "स", attributes: [.font: font, .foregroundColor: gold, .paragraphStyle: paragraph])
let bounds = text.size()
text.draw(in: NSRect(x: 0, y: (CGFloat(size) - bounds.height) / 2 - 18, width: CGFloat(size), height: bounds.height))
image.unlockFocus()
let data = NSBitmapImageRep(data: image.tiffRepresentation!)!.representation(using: .png, properties: [:])!
try data.write(to: URL(fileURLWithPath: output))
