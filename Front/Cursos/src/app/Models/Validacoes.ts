import { AbstractControl, Validators } from "@angular/forms";

export class validacoes{
  constructor() {}

  static dataMenorQueAtual() {
    return (control: AbstractControl):  Validators => {
      const data = control.value;
      const dataAtual: any = new Date();
      const dataAtualFormatada = dataAtual.split('T')[0];
      console.log(dataAtualFormatada);
      console.log(data);
      if(data < dataAtualFormatada){
        return {dataInicioInvalida : true};
      }
      return true;
    };
  }
}
