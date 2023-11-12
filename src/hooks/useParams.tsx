// const urlParams: params = {}
// const pstr = window.location.toString().split("?")
// pstr.length > 1 && pstr[1].split("&").forEach(param => {
//     const [key, value] = param.split("=")
//     urlParams[key] = value
// })
type params = {
    [foo: string]: string
}

export default function useParams() {
    const params: params = {}
    const pstr = window.location.toString().split("?")
    pstr.length > 1 && pstr[1].split("&").forEach(param => {
        const [key, value] = param.split("=")
        params[key] = value
    })
    return params
}