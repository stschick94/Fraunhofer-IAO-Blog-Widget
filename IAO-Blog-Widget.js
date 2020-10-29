const widget = new ListWidget()

const data = await loadData()
const xmlParser = new XMLParser(data)
const logoImg = await getImage()
const dateFormatter = new DateFormatter()
dateFormatter.useShortDateStyle()
dateFormatter.useShortTimeStyle()


let elementName = ""
let currentValue = null
let items = []
let currentItem = null

xmlParser.didStartElement = name => {
  currentValue = ""
  if (name == "item") {
    currentItem = {}
    currentItem["categories"] = []
  }
}

xmlParser.didEndElement = name => {
  const hasItem = currentItem != null
  if (hasItem && name == "title") {
    currentItem["title"] = currentValue
  }
  if (hasItem && name == "dc:creator") {
    currentItem["author"] = currentValue
  }
  if (hasItem && name == "description") {
    currentItem["description"] = currentValue
  }
  
  if (hasItem && name == "pubDate") {
    currentItem["pubDate"] = currentValue
  }
  
  if (hasItem && name == "link") {
    currentItem["link"] = currentValue
  }
  
  if (hasItem && name == "category") {
    currentItem["categories"].push(currentValue)
  }
  
  if (name == "item") {
    items.push(currentItem)
    currentItem = {}
  }
}

xmlParser.foundCharacters = str => {
  currentValue += str
}

await createWidget()
Script.setWidget(widget)
Script.complete()

function createWidget() {
  widget.useDefaultPadding()
  const titleFontSize = 15
  const detailFontSize = 12
  
  xmlParser.parse()

  if (config.widgetFamily == "medium"){
// Medium Widget
// row1 col1
    let row1 = widget.addStack()
    row1.layoutHorizontally()
    let logoStack = row1.addStack()
    let imgView = logoStack.addImage(logoImg)
    imgView.imageSize = new Size(50, 50)
    imgView.cornerRadius = 2
// row1 col2
    let dataColumn = row1.addStack()
    dataColumn.layoutVertically()
    dataColumn.centerAlignContent()
    
    let staticTitle = dataColumn.addStack()
    staticTitle.url = "https://blog.iao.fraunhofer.de/"
    staticTitle.addSpacer(5)
    let staticTitleTxt = staticTitle.addText("Fraunhofer IAO Blog")
    staticTitleTxt.font = Font.boldRoundedSystemFont(titleFontSize)
    
    let authorView = dataColumn.addStack()
    authorView.addSpacer(5)
    let authorViewTxt = authorView.addText(items[0].author)
    authorViewTxt.font = Font.mediumRoundedSystemFont(detailFontSize)
    
    let dateView = dataColumn.addStack()
    dateView.addSpacer(5)
    let dateViewTxt = dateView.addText(dateFormatter.string(new Date(items[0].pubDate)))
        dateViewTxt.font = Font.mediumRoundedSystemFont(detailFontSize)
widget.addSpacer(10)
        
// row2
    let row2 = widget.addStack()
    let title = row2.addStack()
    title.url = items[0].link
    title.layoutHorizontally()
    let titleTxt = title.addText(items[0].title)
    titleTxt.font = Font.boldRoundedSystemFont(titleFontSize)
  }
  else if (config.widgetFamily == "large") {
// Large Widget
// row1 col1
    let row1 = widget.addStack()
    row1.layoutHorizontally()
    let logoStack = row1.addStack()
    let imgView = logoStack.addImage(logoImg)
    imgView.imageSize = new Size(50, 50)
    imgView.cornerRadius = 2
// row1 col2
    let dataColumn = row1.addStack()
    dataColumn.layoutVertically()
    dataColumn.centerAlignContent()
    
    let staticTitle = dataColumn.addStack()
    staticTitle.url = "https://blog.iao.fraunhofer.de/"
    staticTitle.addSpacer(5)
    let staticTitleTxt = staticTitle.addText("Fraunhofer IAO Blog")
    staticTitleTxt.font = Font.boldRoundedSystemFont(titleFontSize)
    
    let authorView = dataColumn.addStack()
    authorView.addSpacer(5)
    let authorViewTxt = authorView.addText(items[0].author)
    authorViewTxt.font = Font.mediumRoundedSystemFont(detailFontSize)
    
    let dateView = dataColumn.addStack()
    dateView.addSpacer(5)
    let dateViewTxt = dateView.addText(dateFormatter.string(new Date(items[0].pubDate)))
        dateViewTxt.font = Font.mediumRoundedSystemFont(detailFontSize)
widget.addSpacer(10)
        
// row2
    let row2 = widget.addStack()
    let title = row2.addStack()
    title.url = items[0].link
    title.layoutHorizontally()
    let titleTxt = title.addText(items[0].title)
    titleTxt.font = Font.boldRoundedSystemFont(titleFontSize)
    widget.addSpacer(10)
    
// row3
    let row3 = widget.addStack()
    let description = row3.addStack()
    description.url = items[0].link
    description.layoutHorizontally()
    let descriptionTxt = description.addText(items[0].description)
    descriptionTxt.font = Font.mediumRoundedSystemFont(detailFontSize)
    widget.addSpacer()
    
// row4
// join categories to one string
    let categoriesString = ""
    for (var i = 0; i < items[0].categories.length; i++){
     
      i != 0 ? 
      (categoriesString += ", ") : null
      categoriesString += items[0].categories[i]
  }
    
    let row4 = widget.addStack()
    let categories = row4.addStack()
    categories.layoutHorizontally()
    let categoryTxt = categories.addText(categoriesString)
    categoryTxt.font = Font.boldRoundedSystemFont(detailFontSize)
    
    
  } else if (config.widgetFamily == "small"){
// Small Widget
    
    let row1 = widget.addStack()
    let authorView = row1.addStack()
    let authorViewTxt = authorView.addText(items[0].author)
    authorViewTxt.font = Font.mediumRoundedSystemFont(13)
    
    let row2 = widget.addStack()
    let title = row2.addStack()
    widget.url = items[0].link
    let titleTxt = title.addText(items[0].title)
    titleTxt.font = Font.boldRoundedSystemFont(13)
  }
}

async function loadData(){
  let url = "https://blog.iao.fraunhofer.de/feed/"
  let req = new Request(url)
  return await req.loadString()
}

async function getImage() {
  let fm = FileManager.local()
  let dir = fm.documentsDirectory()
  let path = fm.joinPath(dir, "logo")
  if (fm.fileExists(path)) {
    // get from local storage
      return fm.readImage(path)
  } else {
    // download once
let iconImage = await loadImage("https://www.ecofleetservices.de/wp-content/uploads/2020/10/LogoFraunhofer.png")
    fm.writeImage(path, iconImage)
    return iconImage
  }
}

// download an image with the given url
async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}
