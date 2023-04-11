import puppeteer from "puppeteer"
import fs from "fs"

let url = (movieName) => {
	return `https://www.tamil2lyrics.com/movies/${movieName}/`
}

let getLyrics = async (url) => {
	const browser = await puppeteer.launch({ headless: false })
	const page = await browser.newPage()
	await page.goto(url)

	const allLinks = await page.evaluate(() => {
		const links = document.querySelectorAll(
			"div.col-lg-6.col-sm-6.col-xs-6 > a"
		)
		const linksArray = [...links]
		const linksArray2 = linksArray.map((link) => link.href)
		return linksArray2
	})

	for (let i = 0; i < allLinks.length; i++) {
		const newPage = await browser.newPage()
		await newPage.goto(allLinks[i])
		const lyrics = await newPage.evaluate(() => {
			let lyrics = document.querySelectorAll("div#Tamil > p")
			lyrics = [...lyrics]
			lyrics.splice(0, 2)
			lyrics.forEach((lyric) => {
				lyric.removeChild(lyric.firstChild)
			})

			const lyricsArray = [...lyrics]
			return lyricsArray.map((lyric) => lyric.innerText)
		})
		console.log(lyrics)
		let fileNameArray = allLinks[i].split("/")
		let fileName = fileNameArray[fileNameArray.length - 2]
		saveToFile(fileName + ".txt", lyrics)

		await newPage.close()
	}

	await browser.close()
}

getLyrics(url("24"))

async function saveToFile(songName, lyricsContent) {
	const folderName = `songs`
	const fileName = `${folderName}/${songName}`

	lyricsContent = lyricsContent.join("")

	fs.writeFile(fileName, lyricsContent, (err) => {
		if (err) throw err
		console.log(`Saved ${songName}!`)
	})
}
