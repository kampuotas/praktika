<script lang="ts">
    import type { PageData } from './$types';
    import { enhance } from '$app/forms';

    export let form: any;
    export let data: PageData;

</script>

<form method="post" use:enhance>
    {#if form?.error}
        <span class="text-red-600">{form.error}</span>
    {/if}
    <input type="text" name="username" placeholder="Username" />
    <input type="password" name="password" placeholder="Password" />
    <button type="submit">Submit</button>
</form>
