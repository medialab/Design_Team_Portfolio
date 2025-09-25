<script lang="ts">

let props = $props();


let ra: string = props.imageShape === 'Vertical' ? '3/4' : props.imageShape === 'Horizontal' ? '4/3' : props.imageShape === 'Square' ? '1/1' : '4/3';


if (!props.imageShape || props.imageShape != 'Vertical' && props.imageShape != 'Horizontal' && props.imageShape != 'Square') {
    ra = '4/3';
}
 
if (!props.cardSize || props.cardSize != 'S' && props.cardSize != 'M' && props.cardSize != 'L') {
    props.cardSize = 'S';
}

</script>

<div class="card_container">
    <div class="image_container"
    style="aspect-ratio: {ra}">
        <img src={props.image} alt={props.title} />
    </div>
    <div class="info_container" style="width: {props.cardSize === 'S' ? '20ch' : props.cardSize === 'M' ? '30ch' : '40ch'}">
        <p class="notes">#{props.tag}</p>
        <h2>{props.title}</h2>
        <div class="specifications_container">
            <p class="notes">{props.project_type} | {props.year_begin} - {props.year_end}</p>
            <p class="notes">Inquiry lead: {props.inquiry_lead}</p>
        </div>
    </div>
</div>

<style>
.card_container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    column-gap: 0px;
    width: fit-content;
    height: fit-content;
    column-gap: var(--spacing-s);
    background-color: white;
}

.image_container {
    height: 13vh;
    place-self: center;
}

.image_container > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    
}

.info_container {
    display: flex;
    flex-direction: column;
    row-gap: var(--spacing-xs);
    align-items: flex-start;
    justify-content: center;
    width: 20ch;
    padding: var(--spacing-s);
    padding-left: 0px;
}

.info_container > h2 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>