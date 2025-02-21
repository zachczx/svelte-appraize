<script lang="ts">
	import AboutSegment from '$lib/AboutSegment.svelte';
	import ErrorNaughtyDog from '$lib/svg/error-naughty-dog.svg?dataurl';
</script>

<main class="grid content-center justify-items-center py-8">
	<article class="w-full max-w-[800px]">
		<header class="mb-8 grid gap-4">
			<h1 class="text-3xl">About Appraize</h1>
			<p>Replace slow Excel-based HR performance ranking.</p>
			<p>
				Key improvements include drag & drop ranking, user permissions, and enhanced functionality for efficient annual
				appraisals.
			</p>
		</header>

		<AboutSegment question="So, what's this app even for?">
			<p>
				It's for anyone who's stuck doing HR performance rankings in clunky old Excel. This app is my attempt to make it
				way smoother and faster using drag & drop – way better than messing with spreadsheets!
			</p>
		</AboutSegment>

		<AboutSegment question="Wait, is this thing actually free? For real?">
			<p>
				Yep, totally free! It's just a fun side project of mine. So go ahead and use it to make your ranking life a
				little easier. No charge at all.
			</p>
		</AboutSegment>

		<AboutSegment question="Can I just dump my HR data in here? Like, from our system?">
			<p>
				Yup, via a csv file. Just make sure the file has columns named: Name, Department, Grade, and Remarks – in that
				order. Then, boom, upload it and you're ready to rank.
			</p>
		</AboutSegment>

		<AboutSegment question="Hey, can I see folks' *past* grades in this thing?">
			<p>
				Good question! So, the app *does* store past grades in the background, but I haven't actually built the user
				interface yet. It's on my maybe-to-do list though. If enough people want it, I can definitely bump it up the
				priority list. Let me know if it's something you'd find useful!
			</p>
		</AboutSegment>

		<AboutSegment question="Where does everything get saved?">
			<p>
				Your data's on my virtual private server. It hosts, among several of my other side projects, a PostgreSQL
				database that holds everything.
			</p>
		</AboutSegment>

		<AboutSegment question="Won't you be able to see the ranking results?">
			<p>It's all in the database, so yes, I can see it if I took the trouble to query the database.</p>
		</AboutSegment>
	</article>
</main>
