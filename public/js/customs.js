// document.addEventListener("DOMContentLoaded", function(){
//     // make it as accordion for smaller screens
//     if (window.innerWidth > 992) {
    
//         document.querySelectorAll('.navbar .nav-item').forEach(function(everyitem){
    
//             everyitem.addEventListener('mouseover', function(e){
    
//                 let el_link = this.querySelector('a[data-bs-toggle]');
    
//                 if(el_link != null){
//                     let nextEl = el_link.nextElementSibling;
//                     el_link.classList.add('show');
//                     nextEl.classList.add('show');
//                 }
    
//             });
//             everyitem.addEventListener('mouseleave', function(e){
//                 let el_link = this.querySelector('a[data-bs-toggle]');
    
//                 if(el_link != null){
//                     let nextEl = el_link.nextElementSibling;
//                     el_link.classList.remove('show');
//                     nextEl.classList.remove('show');
//                 }
    
    
//             })
//         });
    
//     }
//     // end if innerWidth
//     });

//     window.onload = function() {
        
     
// jQuery(document).ready(function(){
//         // Add minus icon for collapse element which is open by default
//         $(".collapse.show").each(function(){
//             $(this).prev(".card-header").find(".fa").addClass("fa-angle-down").removeClass("fa-angle-up");
//         });
        
//         // Toggle plus minus icon on show hide of collapse element
//         $(".collapse").on('show.bs.collapse', function(){
//             $(this).prev(".card-header").find(".fa").removeClass("fa-angle-up").addClass("fa-angle-down");
//         }).on('hide.bs.collapse', function(){
//             $(this).prev(".card-header").find(".fa").removeClass("fa-angle-down").addClass("fa-angle-up");
//         });



        
//     });






//     (function() {

//         function addSeparator(nStr) {
//             nStr += '';
//             var x = nStr.split('.');
//             var x1 = x[0];
//             var x2 = x.length > 1 ? '.' + x[1] : '';
//             var rgx = /(\d+)(\d{3})/;
//             while (rgx.test(x1)) {
//                 x1 = x1.replace(rgx, '$1' + '.' + '$2');
//             }
//             return x1 + x2;
//         }

//         function rangeInputChangeEventHandler(e){
//             var rangeGroup = $(this).attr('name'),
//                 minBtn = $(this).parent().children('.min'),
//                 maxBtn = $(this).parent().children('.max'),
//                 range_min = $(this).parent().children('.range_min'),
//                 range_max = $(this).parent().children('.range_max'),
//                 minVal = parseInt($(minBtn).val()),
//                 maxVal = parseInt($(maxBtn).val()),
//                 origin = $(this).context.className;

//             if(origin === 'min' && minVal > maxVal-1){
//                 $(minBtn).val(maxVal-1);
//             }
//             var minVal = parseInt($(minBtn).val());
//             $(range_min).html(addSeparator(minVal) );


//             if(origin === 'max' && maxVal-1 < minVal){
//                 $(maxBtn).val(1+ minVal);
//             }
//             var maxVal = parseInt($(maxBtn).val());
//             $(range_max).html(addSeparator(maxVal) );
//         }

//      $('input[type="range"]').on( 'input', rangeInputChangeEventHandler);
// })();
    


jQuery(document).ready(function(){
    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        dots:true,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:1
            },
            1000:{
                items:1
            }
        }
    })
    });


    // }
    
    
