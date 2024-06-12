import { ref, reactive } from 'vue'
import Radio from './radio.js'

export default {
    components: {
        radio: Radio
    },
    setup() {
        const parseInfo = reactive({
            lines: 0,
            layers: 0,
            fileName: '',
        })

        const ready = ref(false)

        const dropDirections = [
            { id: 'x+', name: 'X+', x: 1, y: 0 },
            { id: 'x-', name: 'X-', x: -1, y: 0 },
            { id: 'y+', name: 'Y+', x: 0, y: 1 },
            { id: 'y-', name: 'Y-', x: 0, y: -1 },
        ]

        let gCode = ''

        async function onProcess($event) {
            const formData = new FormData($event.target)
            ready.value = false
            const file = formData.get('fileName')
            gCode = (await file.text()).split("\n")
            parseInfo.fileName = file.name
            parseInfo.lines = gCode.length
            parseInfo.layers = gCode[findLastLineWith('G1 Z')]

            modifyGCode()
            ready.value = true
        }

        function onDownload() {
            const href = window.URL.createObjectURL(new Blob([gCode.join("\n")], {type: "text/plain"}))

            // create "a" HTML element with href to file & click
            const link = document.createElement('a')
            link.href = href
            link.setAttribute('download', 'loop_' + parseInfo.fileName)
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        }

        function modifyGCode() {
            insertM808Start()
            insertM808End()
        }

        function insertM808Start() {
            const startLineIndex = findFirstLineWith(';LAYER_CHANGE');
            gCode.splice(startLineIndex, 0, "M808 ; Loop start")
        }

        function insertM808End() {
            const endLineIndex = findFirstLineWith('M104 S0');
            gCode.splice(endLineIndex, 0, "M808 L ; Loop end")
        }

        function findFirstLineWith(s) {
            return gCode.findIndex((line) => line.includes(s))
        }
        function findLastLineWith(s) {
            return gCode.findLastIndex((line) => line.includes(s))
        }

        // https://github.com/remcoder/gcode-preview
        return { parseInfo, onProcess, ready, onDownload, dropDirections }
    }
}
