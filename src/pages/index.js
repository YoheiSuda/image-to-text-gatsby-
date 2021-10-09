import * as React from "react"

import { createWorker } from 'tesseract.js';
import "../css/index.scss";

// markup
const IndexPage = () => {
	const [selectedValue, setSelectedValue] = React.useState("jpn");

	return (
		<main>
			<title>image to text</title>
			<h1>画像を元に文字起こしするやつ（日本語・英語対応）</h1>
			<select defaultValue="jpn" onChange={e => setSelectedValue(e.target.value)}>
				<option value="jpn">日本語</option>
				<option value="eng">英語</option>
			</select>
			<input type="file" id="selectImage" accept="image/*" onChange={e => selectImage(e, selectedValue)} />
			<img id="preview"/>			
			<div className="log">
				<p id="log__progress"></p>
				<p id="log__result"></p>	
			</div>	
		</main>
	)
}

const selectImage = (e, selectedValue) => {
	const reader = new FileReader();
	const preview = document.getElementById('preview');
	const log__progress = document.getElementById('log__progress');
	const log__result = document.getElementById('log__result');
	reader.onload = (e) => {
		console.log(e.target.result);
		preview.setAttribute('src', e.target.result);

		const worker = createWorker({
			logger: m => {
				console.log(m)
				log__progress.textContent = (m.progress * 100) + "%";
			}
		  });
		  

		  (async () => {
			await worker.load();
			await worker.loadLanguage(selectedValue);
			await worker.initialize(selectedValue);
			const { data: { text } } = await worker.recognize(e.target.result);
			console.log(text);
			log__result.textContent = text;
			await worker.terminate();
		  })();
	}
	reader.readAsDataURL(e.target.files[0]);
}

export default IndexPage
