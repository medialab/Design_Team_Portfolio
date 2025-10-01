

<footer>
    <p class="notes">Privacy policy</p>
    <p class="notes">Cookie policy</p>
</footer>


<style>
footer {
    width: 100%;
    height: fit-content;
    padding: var(--spacing-l);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

footer > * {
    background-color: white;
}

@media (max-width: 768px) {
    footer {
        position: static;
        padding: var(--spacing-m) 0px var(--spacing-m) 0px;
    }
}
</style>