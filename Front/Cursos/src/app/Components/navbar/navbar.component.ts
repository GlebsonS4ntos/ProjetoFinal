import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  logo = "assets/logo/logo.png";

  constructor() {
    $(function(){
      $('ul li a').click(function(i){
        $('ul li a').removeClass('active');
        $(this).addClass('active');
      });
      $('ul li a').hover(function(i){
        $('ul li a').removeClass('active');
        $(this).addClass('active');
      });
    });
  }

  ngOnInit(): void {
  }

}
