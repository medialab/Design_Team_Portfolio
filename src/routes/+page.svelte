<script>
    import Header from '$lib/components/header.svelte';
    import Footer from '$lib/components/footer.svelte';
    import Card from '$lib/components/card.svelte';
    
    import test_image from '$lib/media/test.gif';

    </script>
    
    <Header />
    
    
    <section class="cards_container">
        <Card 
        image={test_image}
        tag="EL2MP"
        title="Ecologies of LLM Practices: an inquiry on daily professional usage of LLMs"
        project_type="Exhibition"
        year_begin="2020"
        year_end="2021"
        inquiry_lead="Donato Ricci"
        cardSize="S"
        imageShape="Vertical"
        />
    
        <Card 
        image={test_image}
        tag="EL2MP"
        title="Ecologies of LLM Practices: an inquiry on daily professional usage of LLMs"
        project_type="Exhibition"
        year_begin="2020"
        year_end="2021"
        inquiry_lead="Donato Ricci"
        cardSize="M"
        imageShape="Square"
        />
    
        <Card 
        image={test_image}
        tag="EL2MP"
        title="Ecologies of LLM Practices: an inquiry on daily professional usage of LLMs"
        project_type="Exhibition"
        year_begin="2020"
        year_end="2021"
        inquiry_lead="Donato Ricci"
        cardSize="L"
        imageShape="Horizontal"
        />
    </section>
    
    <Footer />
    
    <style>
    
    .cards_container {
        width: 100%;
        height: 600px;
    
        padding: var(--spacing-l);
        margin-top: var(--spacing-xxl);
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        row-gap: var(--spacing-m);
        justify-content: space-between;
    }
    
    </style>