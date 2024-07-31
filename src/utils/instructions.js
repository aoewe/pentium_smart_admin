const Instructions = {}
Instructions.install = Vue => {
  Vue.directive('convert', {
    inserted(el, binding) {
      if (parseInt(binding.value) > 1000 || parseInt(binding.value) === 0) {
        el.innerHTML = (parseInt(binding.value) / 1000 || 0).toFixed(2) + '吨'
      } else {
        el.innerHTML = (parseInt(binding.value) || 0).toFixed(2) + 'kg'
      }
      el.focus()
    }
  })
}
export default Instructions
