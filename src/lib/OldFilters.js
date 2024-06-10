// Old filter functions using CSS only, but not good when working with form actions for CRUD

/**
 *
 * @param {string} filterField - the attribute to search in (
 * id: serial
 * uuid: uuid
 * name: text
 * dept: text
 * grade: text
 * session: text
 * sequence: integer
 * previous: boolean
 * remarks: varchar
 * timestamp: timestamp
 * )
 * @param {string} filterInputToFilter - input from text field, bind to $state() rune
 */
export async function filterResult(filterField, filterInputToFilter) {
	let result = data.streamed.result;
	console.log('Results: ', result);
	let filterResult = result.filter((item) => {
		let field = item[filterField];
		return field.includes(filterInputToFilter);
	});
	// console.log('Raw filtered objects: ', filterResult);
	let filterResultArray = [];
	for (let i = 0; i < filterResult.length; i++) {
		let filterResultArrayTemp = filterResult[i].id;
		filterResultArray.push(filterResultArrayTemp);
	}
	// console.log(filterResultArray);
	let addHiddenClassForFilter;
	let hiddenCount = 0;

	for (let i = 0; i < result.length; i++) {
		let resetClasses = document.getElementById(result[i].uuid);
		resetClasses?.classList.remove('hidden');
		if (filterResultArray.indexOf(result[i].id) > -1) {
			console.log('found these!', result[i]);
		} else {
			addHiddenClassForFilter = document.getElementById(result[i].uuid);
			addHiddenClassForFilter.classList.add('hidden');
			hiddenCount += 1;
		}
	}
	if (hiddenCount === result.length) {
		console.log("everything's hidden!!!");
		filterNothingFound = true;
	}
}

/**
 * Reset filters by removing all css hidden applied
 */
export async function resetFilters() {
	await data.streamed.result;
	for (let i = 0; i < data.streamed.result.length; i++) {
		let resetFilterGrade = document.getElementById(data.streamed.result[i].uuid);
		resetFilterGrade.classList.remove('hidden');
	}
}
