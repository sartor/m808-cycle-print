export default {
    props: {
        id: String,
        name: String,
        variants: Array,
        required: {
            type: Boolean,
            default: false
        }
    },
    template: `
<br/>
<div class="btn-group">
    <template v-for="variant in variants">
        <input class="btn-check" type="radio" :name="name" :id="'radio-' + variant.id"  :value="variant.id" :required="required">
        <label class="btn btn-primary" :for="'radio-' + variant.id">{{ variant.name }} </label>
    </template>
</div>
`
}