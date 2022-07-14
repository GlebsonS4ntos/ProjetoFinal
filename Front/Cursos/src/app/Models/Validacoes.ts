import { AbstractControl, Validators } from "@angular/forms";

export class validacoes{
  constructor() {}

  static dataMenorQueAtual() {
    return (control: AbstractControl):  Validators => {
      const data = control.value;
      if(data != null) {
        const dataAtual = new Date();
        const dataAtualFormatada = dataAtual.toISOString().split('T')[0];
        if(parseInt(data) < parseInt(dataAtualFormatada)){
          return {dataInicioInvalida : true};
        }
      }
      return false;
    };
  }
}
