import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hsedu-feature',
  templateUrl: './hsedu-feature.component.html',
  styleUrls: ['./hsedu-feature.component.less']
})
export class HseduFeatureComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $(function () {

      $('.nav-menu-list li').each(function () {
        if ($(this).hasClass('function_nav')) {
          $(this).addClass('alicurrent');
        } else {
          $(this).removeClass('alicurrent');
        }
      });

      const left1 = $('.carousel-content li:nth-of-type(1)').position().left;
      const left2 = $('.carousel-content li:nth-of-type(2)').position().left;
      const left3 = $('.carousel-content li:nth-of-type(3)').position().left;

      $('.carousel-content li:nth-of-type(1)').click(function () {

        if ($(this).hasClass('content-current')) {
          $(this).animate({ 'left': '286px' });
        } else {
          if ($('.carousel-content li:nth-of-type(2)').position().left === left2 && $('.carousel-content li:nth-of-type(3)').position().left === left3) {

            $(this).animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(2)').animate({ 'left': '0px' }, 300);

            $('.function-list>div:nth-of-type(1)').parent().show();

            $('.function-list>div:nth-of-type(1)').show().siblings('div').hide();

          } else if ($('.carousel-content li:nth-of-type(2)').position().left === left1 && $('.carousel-content li:nth-of-type(3)').position().left === left2) {
            $(this).animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(3)').animate({ 'left': '600px' }, 300);

            $('.function-list>div:nth-of-type(1)').parent().show();

            $('.function-list>div:nth-of-type(1)').show().siblings('div').hide();

          } else if ($('.carousel-content li:nth-of-type(2)').position().left === left2 && $('.carousel-content li:nth-of-type(3)').position().left === left1) {
            $(this).animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(2)').animate({ 'left': '600px' }, 300);

            $('.function-list>div:nth-of-type(1)').parent().show();

            $('.function-list>div:nth-of-type(1)').show().siblings('div').hide();

          } else if ($('.carousel-content li:nth-of-type(2)').position().left === left3 && $('.carousel-content li:nth-of-type(3)').position().left === left2) {
            $(this).animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(3)').animate({ 'left': '0px' }, 300);

            $('.function-list>div:nth-of-type(1)').parent().show();

            $('.function-list>div:nth-of-type(1)').show().siblings('div').hide();

          }

        }


      });

      $('.carousel-content li:nth-of-type(2)').click(function () {
        if ($(this).hasClass('content-current')) {
          $(this).animate({ 'left': '286px' });
        } else {
          if ($('.carousel-content li:nth-of-type(1)').position().left === left2 && $('.carousel-content li:nth-of-type(3)').position().left === left3) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(1)').stop().animate({ 'left': '0px' }, 300);

            $('.function-list>div:nth-of-type(2)').parent().show();

            $('.function-list>div:nth-of-type(2)').show().siblings('div').hide();
          } else if ($('.carousel-content li:nth-of-type(1)').position().left === left3 && $('.carousel-content li:nth-of-type(3)').position().left === left2) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(3)').stop().animate({ 'left': '0px' }, 300);

            $('.function-list>div:nth-of-type(2)').parent().show();

            $('.function-list>div:nth-of-type(2)').show().siblings('div').hide();
          } else if ($('.carousel-content li:nth-of-type(1)').position().left === left1 && $('.carousel-content li:nth-of-type(3)').position().left === left2) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(3)').stop().animate({ 'left': '600px' }, 300);
            $('.function-list>div:nth-of-type(2)').parent().show();

            $('.function-list>div:nth-of-type(2)').show().siblings('div').hide();
          } else if ($('.carousel-content li:nth-of-type(1)').position().left === left2 && $('.carousel-content li:nth-of-type(3)').position().left === left1) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(1)').stop().animate({ 'left': '600px' }, 300);
            $('.function-list>div:nth-of-type(2)').parent().show();

            $('.function-list>div:nth-of-type(2)').show().siblings('div').hide();
          }
        }


      });

      $('.carousel-content li:nth-of-type(3)').click(function () {
        if ($(this).hasClass('content-current')) {
          $(this).stop().animate({ 'left': '286px' });
        } else {
          if ($('.carousel-content li:nth-of-type(1)').position().left === left2 && $('.carousel-content li:nth-of-type(2)').position().left === left1) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(1)').stop().animate({ 'left': '600px' }, 300);

            $('.function-list>div:nth-of-type(3)').parent().show();

            $('.function-list>div:nth-of-type(3)').show().siblings('div').hide();
          } else if ($('.carousel-content li:nth-of-type(2)').position().left === left2 && $('.carousel-content li:nth-of-type(1)').position().left === left3) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(2)').stop().animate({ 'left': '0px' }, 300);

            $('.function-list>div:nth-of-type(3)').parent().show();

            $('.function-list>div:nth-of-type(3)').show().siblings('div').hide();

          } else if ($('.carousel-content li:nth-of-type(1)').position().left === left1 && $('.carousel-content li:nth-of-type(2)').position().left === left2) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(2)').stop().animate({ 'left': '600px' }, 300);
            $('.function-list>div:nth-of-type(3)').parent().show();

            $('.function-list>div:nth-of-type(3)').show().siblings('div').hide();

          } else if ($('.carousel-content li:nth-of-type(1)').position().left === left1 && $('.carousel-content li:nth-of-type(2)').position().left === left3) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(1)').stop().animate({ 'left': '0px' }, 300);

            $('.function-list>div:nth-of-type(3)').parent().show();

            $('.function-list>div:nth-of-type(3)').show().siblings('div').hide();

          } else if ($('.carousel-content li:nth-of-type(1)').position().left === left2 && $('.carousel-content li:nth-of-type(2)').position().left === left3) {
            $(this).stop().animate({ 'left': '286px' }, 300).addClass('content-current').siblings().removeClass('content-current');

            $('.carousel-content li:nth-of-type(1)').stop().animate({ 'left': '0px' }, 300);

            $('.function-list>div:nth-of-type(3)').parent().show();

            $('.function-list>div:nth-of-type(3)').show().siblings('div').hide();

          }

        }


      });



      function toggle_Function(a, b) {
        $(a).click(function () {
          $(b).stop().toggle();
        });
      }
      toggle_Function('.h-s1', '.study-list3');
      toggle_Function('.h-s2', '.study-list1');
      toggle_Function('.h-s3', '.study-list2');


      $('.con-dec').click(function () {
        let num = $(this).parent('li').index();
        num++;
        const fun_Scroll = $('.function-list>div:nth-of-type(1)').offset().top;
        $('.function-list>div:nth-of-type(' + num + ')').parent('div').toggle();
        $('body,html').animate({
          scrollTop: fun_Scroll + 250 // 让body的scrollTop等于pos的top，就实现了滚动
        }, 300);
      });

      $('#close').click(function () {
        $('.function-list').hide();
      });

    });
  }

}
