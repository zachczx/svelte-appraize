/**
 *
 * @param {KeyboardEvent} evt - event from keydown (ctr+enter)
 * @param {string} formId - html ID of form
 */

export function editFormSubmitKeyboardShortcut(evt, formId) {
	if (evt.ctrlKey && evt.key === 'Enter') {
		console.log('Combo pressed');
		let form = document.getElementById(formId);
		form.requestSubmit();
		console.log('Form submitted!');
	}
}
