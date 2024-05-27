<script>
	export let value;
	export let placeholder;
	export let name;
	export let classAttr;
</script>

<input type="text" {value} class={classAttr} {placeholder} {name} {...$$props} />
