<script>
import Header from '$lib/components/header.svelte';
import Footer from '$lib/components/footer.svelte';

</script>

<Header type="project" isAbout={false}/>

<section class="main_container">
    <div class="text_Container">
        <p class="about_text">
            <span class="bolder">Laboratoire de recherche interdisciplinaire</span> réunissant sociologues, ingénieurs et designers, le médialab mène des recherches thématiques et méthodologiques exploitant et interrogeant la place prise par le numérique dans nos sociétés.
Le numérique transforme nos sociétés mais aussi la production de la connaissance scientifique. Centrale dans l’approche développée au médialab, la transition numérique invite à articuler trois approches fondées sur les sciences sociales, l'ingénierie et le design. Par la multitude de données qu’elle génère, la transition numérique contribue à élargir les connaissances que nous avons des différents mondes sociaux. En parallèle, elle offre des instruments d’investigation favorisant de nouveaux modes de production des savoirs à travers la modélisation, la visualisation et l’exploration interactive des corpus. Enfin elle invite à expérimenter avec les publics et les étudiants en encourageant de nouvelles formes de réflexivité et de partage des résultats de la recherche. 
        </p>
    </div>
    <a class="cta" href="mailto:donato.ricci@sciencespo.fr">
        <h2>Write us an email</h2><svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px"><path d="m490-527 37 37 217-217-37-37-217 217ZM200-200h37l233-233-37-37-233 233v37Zm355-205L405-555l167-167-29-29-219 219-56-56 218-219q24-24 56.5-24t56.5 24l29 29 50-50q12-12 28.5-12t28.5 12l93 93q12 12 12 28.5T828-678L555-405ZM270-120H120v-150l285-285 150 150-285 285Z"/></svg>
    </a>
    <Footer />
</section>




<style>

    .cta {
        width: fit-content;
        padding: var(--spacing-s) var(--spacing-m);
        display: flex;
        flex-direction: row;
        gap: var(--spacing-s);
        align-items: center;
        justify-content: center;
        background-color: var(--color-surface);
    }


    .main_container {
        display: flex;
        flex-direction: column;
        margin: var(--spacing-xxl) var(--spacing-l) var(--spacing-l) var(--spacing-l);
        row-gap: var(--spacing-l);
        padding-bottom: var(--spacing-xl);
    }

    .text_Container {
        width: 100%;
        height: max-content;
        padding-top: var(--spacing-m)
    }

    .about_text {
        font-size: 64px;
        color: var(--secondary-dark);
        line-height: 1.15;
        letter-spacing: -0.06em;
    }

    ::selection {
        background-color: #ff0b0b;
        color: var(--color-surface);
    }

    .bolder {
        font-weight: 500;
        color: var(--primary-black);
    }

    @media (max-width: 768px) {
        .main_container {
            padding: 0px;
            row-gap: var(--spacing-m);
            margin: var(--spacing-xl) var(--spacing-m) var(--spacing-m) var(--spacing-m);
        }

        .about_text {
            font-size: 28px;
        }

        .cta {
            width: 100%;
        }
    }

</style>