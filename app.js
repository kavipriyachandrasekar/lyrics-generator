import fs from "fs"

let url = (movieName) => {
	return `https://www.tamil2lyrics.com/movies/${movieName}/`
}


async function saveToFile(songName, lyricsContent) {
	const folderName = `songs`
	const fileName = `${folderName}/${songName}`

	lyricsContent = lyricsContent.join("")

	fs.writeFile(fileName, lyricsContent, (err) => {
		if (err) throw err
		console.log(`Saved ${songName}!`)
	})
}
