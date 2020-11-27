import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import '@capacitor-community/http';
import { Plugins } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  productInformation=null
  barCode:any;
  constructor(public barcodeScanner : BarcodeScanner) {}

  openBarCodeScanner(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.barCode = barcodeData
      //   Barcode data {"cancelled":0,"text":"8413384010008","format":"EAN_13"}

      if (barcodeData) {
        let scanCode = barcodeData["text"];
        if (scanCode) {
          this.getProductWithBarCode(scanCode) 
        }
      }
      else{
        console.log("=== No data scanned !")
      }
    }).catch(err => {
      console.log('Error', err);
    });
  }



  async getProductWithBarCode(barcode){
    const { Http } = Plugins;
    let urlToCall = "https://fr.openfoodfacts.org/api/v0/produit/"+barcode+".json"
    let ret = await Http.request({
      method: 'GET',
      url: urlToCall,
      headers: {
        'content-type': 'application/json',
      }
    });
    console.log(ret.data)
    if (ret.data){
      this.productInformation = ret.data
      console.log("==Product ",this.productInformation.product)
    }
  }

  //Example of response
  /*
 {
   "code":"8413384010008",
   "status":1,
   "product":{
      "languages_hierarchy":[
         "en:french"
      ],
      "nutrition_grades_tags":[
         "a"
      ],
      "completeness":0.5,
      "image_ingredients_small_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/ingredients_fr.7.200.jpg",
      "data_quality_warnings_tags":[
         "en:nutrition-all-values-zero"
      ],
      "compared_to_category":"en:mineral-waters",
      "nutriments":{
         "sodium_unit":"g",
         "saturated-fat_100g":0,
         "sugars_100g":0,
         "energy":0,
         "saturated-fat_unit":"g",
         "nutrition-score-fr_serving":0,
         "carbohydrates":0,
         "salt_100g":0,
         "fat":0,
         "fat_100g":0,
         "saturated-fat_value":0,
         "sugars_unit":"g",
         "sodium":0,
         "energy-kcal_value":0,
         "fat_unit":"g",
         "proteins_unit":"g",
         "salt":0,
         "salt_value":0,
         "fat_value":0,
         "nutrition-score-fr":0,
         "energy-kcal_100g":0,
         "energy_100g":0,
         "salt_unit":"g",
         "energy-kcal_unit":"kcal",
         "sugars_value":0,
         "saturated-fat":0,
         "proteins_100g":0,
         "energy-kcal":0,
         "nutrition-score-fr_100g":0,
         "sodium_100g":0,
         "sodium_value":0,
         "carbohydrates_value":0,
         "proteins":0,
         "energy_value":0,
         "proteins_value":0,
         "carbohydrates_100g":0,
         "sugars":0,
         "energy_unit":"kcal",
         "carbohydrates_unit":"g"
      },
      "popularity_tags":[
         "top-100000-scans-2019",
         "at-least-5-scans-2019",
         "top-90-percent-scans-2019",
         "top-95-percent-scans-2019",
         "top-10000-es-scans-2019",
         "top-50000-es-scans-2019",
         "top-100000-es-scans-2019",
         "top-country-es-scans-2019",
         "at-least-5-es-scans-2019",
         "top-5000-gb-scans-2019",
         "top-10000-gb-scans-2019",
         "top-50000-gb-scans-2019",
         "top-100000-gb-scans-2019"
      ],
      "image_front_thumb_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.100.jpg",
      "_id":"8413384010008",
      "ingredients_debug":[
         
      ],
      "countries_tags":[
         "en:spain"
      ],
      "checkers_tags":[
         
      ],
      "misc_tags":[
         "en:nutrition-no-fruits-vegetables-nuts",
         "en:nutrition-no-fiber-or-fruits-vegetables-nuts",
         "en:nutriscore-computed"
      ],
      "languages_tags":[
         "en:french",
         "en:1"
      ],
      "image_front_small_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.200.jpg",
      "scans_n":13,
      "categories_properties_tags":[
         "all-products",
         "categories-known",
         "agribalyse-food-code-18430",
         "agribalyse-food-code-known",
         "agribalyse-proxy-food-code-76000",
         "agribalyse-proxy-food-code-known",
         "ciqual-food-code-18044",
         "ciqual-food-code-known",
         "agribalyse-known",
         "agribalyse-18430"
      ],
      "nutrition_data_per":"100g",
      "categories_hierarchy":[
         "en:beverages",
         "en:waters",
         "en:spring-waters",
         "en:mineral-waters"
      ],
      "image_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.400.jpg",
      "interface_version_modified":"20150316.jqm2",
      "nucleotides_prev_tags":[
         
      ],
      "nutrition_score_beverage":1,
      "ingredients_text_debug":null,
      "other_nutritional_substances_tags":[
         
      ],
      "additives_old_tags":[
         
      ],
      "vitamins_tags":[
         
      ],
      "nutrition_grades":"a",
      "code":"8413384010008",
      "nutriscore_grade":"a",
      "nutrient_levels":{
         "sugars":"low",
         "fat":"low",
         "salt":"low",
         "saturated-fat":"low"
      },
      "additives_original_tags":[
         
      ],
      "nutrition_score_warning_no_fruits_vegetables_nuts":1,
      "traces_hierarchy":[
         
      ],
      "data_quality_info_tags":[
         
      ],
      "creator":"kiliweb",
      "unknown_nutrients_tags":[
         
      ],
      "lc":"fr",
      "allergens_from_user":"(fr) ",
      "update_key":"origins",
      "image_front_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.400.jpg",
      "data_quality_tags":[
         "en:nutrition-all-values-zero"
      ],
      "rev":15,
      "nova_group":1,
      "images":{
         "1":{
            "uploader":"kiliweb",
            "uploaded_t":1548922522,
            "sizes":{
               "100":{
                  "h":100,
                  "w":31
               },
               "400":{
                  "h":400,
                  "w":123
               },
               "full":{
                  "w":368,
                  "h":1200
               }
            }
         },
         "2":{
            "sizes":{
               "100":{
                  "w":100,
                  "h":51
               },
               "400":{
                  "w":400,
                  "h":204
               },
               "full":{
                  "w":2050,
                  "h":1043
               }
            },
            "uploader":"kiliweb",
            "uploaded_t":1548922523
         },
         "3":{
            "uploader":"kiliweb",
            "uploaded_t":1583767711,
            "sizes":{
               "100":{
                  "h":81,
                  "w":100
               },
               "400":{
                  "h":323,
                  "w":400
               },
               "full":{
                  "h":1200,
                  "w":1485
               }
            }
         },
         "ingredients_fr":{
            "y2":null,
            "orientation":"0",
            "rev":"7",
            "white_magic":"0",
            "x2":null,
            "imgid":"2",
            "angle":null,
            "geometry":"0x0-0-0",
            "ocr":1,
            "sizes":{
               "100":{
                  "h":51,
                  "w":100
               },
               "200":{
                  "w":200,
                  "h":102
               },
               "400":{
                  "w":400,
                  "h":204
               },
               "full":{
                  "w":2050,
                  "h":1043
               }
            },
            "normalize":"0",
            "y1":null,
            "x1":null
         },
         "nutrition_fr":{
            "angle":0,
            "rev":"13",
            "y1":"-1",
            "geometry":"0x0--3--3",
            "x1":"-1",
            "normalize":null,
            "y2":"-1",
            "white_magic":null,
            "sizes":{
               "100":{
                  "w":100,
                  "h":81
               },
               "200":{
                  "w":200,
                  "h":162
               },
               "400":{
                  "w":400,
                  "h":323
               },
               "full":{
                  "w":1485,
                  "h":1200
               }
            },
            "imgid":"3",
            "x2":"-1"
         },
         "front_fr":{
            "angle":null,
            "rev":"4",
            "y1":null,
            "geometry":"0x0-0-0",
            "x1":null,
            "normalize":"0",
            "y2":null,
            "white_magic":"0",
            "x2":null,
            "imgid":"1",
            "sizes":{
               "100":{
                  "w":31,
                  "h":100
               },
               "200":{
                  "h":200,
                  "w":61
               },
               "400":{
                  "h":400,
                  "w":123
               },
               "full":{
                  "w":368,
                  "h":1200
               }
            }
         }
      },
      "categories":"Boissons, Eaux, Eaux de sources, Eaux minérales",
      "data_quality_bugs_tags":[
         
      ],
      "allergens_from_ingredients":"",
      "traces_tags":[
         
      ],
      "nova_group_tags":[
         "not-applicable"
      ],
      "popularity_key":-181099999982,
      "image_small_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.200.jpg",
      "category_properties":{
         "ciqual_food_name:fr":"Eau minérale -aliment moyen-",
         "ciqual_food_name:en":"Water, mineral, bottled -average-"
      },
      "allergens":"",
      "no_nutrition_data":"",
      "correctors_tags":[
         "openfoodfacts-contributors",
         "elcoco",
         "yuka.WFlCWk02RVJnTVF2dGN3Rm9RdjU0djB2dzcyd1RYUHVLL0lYSVE9PQ",
         "tacite-mass-editor"
      ],
      "pnns_groups_2":"Waters and flavored waters",
      "last_edit_dates_tags":[
         "2020-04-04",
         "2020-04",
         "2020"
      ],
      "amino_acids_prev_tags":[
         
      ],
      "allergens_hierarchy":[
         
      ],
      "last_image_dates_tags":[
         "2020-03-09",
         "2020-03",
         "2020"
      ],
      "states_hierarchy":[
         "en:to-be-completed",
         "en:nutrition-facts-completed",
         "en:ingredients-to-be-completed",
         "en:expiration-date-to-be-completed",
         "en:packaging-code-to-be-completed",
         "en:characteristics-to-be-completed",
         "en:categories-completed",
         "en:brands-to-be-completed",
         "en:packaging-to-be-completed",
         "en:quantity-completed",
         "en:product-name-completed",
         "en:photos-validated",
         "en:photos-uploaded"
      ],
      "last_image_t":1583767711,
      "product_name":"Agua Mineral Veri 33 cl",
      "ingredients_that_may_be_from_palm_oil_tags":[
         
      ],
      "informers_tags":[
         "yuka.WXE0L0U3dGN1S2dNaDlnKzFCLzYwOU44bTUyVVdXM25MdVVKSVE9PQ",
         "kiliweb",
         "teolemon",
         "elcoco",
         "yuka.UjRZaEZLUUlsL1lncE0wM3h4THY1c2g0Nlk2akFGT21BTkkvSVE9PQ"
      ],
      "categories_lc":"fr",
      "nutrition_data_prepared_per":"100g",
      "categories_tags":[
         "en:beverages",
         "en:waters",
         "en:spring-waters",
         "en:mineral-waters"
      ],
      "max_imgid":"3",
      "categories_properties":{
         "agribalyse_proxy_food_code:en":"76000",
         "agribalyse_food_code:en":"18430",
         "ciqual_food_code:en":"18044"
      },
      "complete":0,
      "nutriscore_score":0,
      "traces_from_ingredients":"",
      "minerals_tags":[
         
      ],
      "product_quantity":330,
      "vitamins_prev_tags":[
         
      ],
      "countries_hierarchy":[
         "en:spain"
      ],
      "_keywords":[
         "minerale",
         "eaux",
         "source",
         "veri",
         "33",
         "mineral",
         "cl",
         "de",
         "agua",
         "boisson"
      ],
      "countries":"en:Spain",
      "image_ingredients_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/ingredients_fr.7.400.jpg",
      "allergens_tags":[
         
      ],
      "nutrient_levels_tags":[
         "en:fat-in-low-quantity",
         "en:saturated-fat-in-low-quantity",
         "en:sugars-in-low-quantity",
         "en:salt-in-low-quantity"
      ],
      "unique_scans_n":9,
      "editors_tags":[
         "kiliweb",
         "yuka.UjRZaEZLUUlsL1lncE0wM3h4THY1c2g0Nlk2akFGT21BTkkvSVE9PQ",
         "elcoco",
         "yuka.WFlCWk02RVJnTVF2dGN3Rm9RdjU0djB2dzcyd1RYUHVLL0lYSVE9PQ",
         "openfoodfacts-contributors",
         "yuka.WXE0L0U3dGN1S2dNaDlnKzFCLzYwOU44bTUyVVdXM25MdVVKSVE9PQ",
         "tacite-mass-editor",
         "teolemon"
      ],
      "last_editor":"tacite-mass-editor",
      "sortkey":-198413998591,
      "entry_dates_tags":[
         "2019-01-31",
         "2019-01",
         "2019"
      ],
      "image_nutrition_small_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/nutrition_fr.13.200.jpg",
      "created_t":1548922522,
      "pnns_groups_1":"Beverages",
      "nutriscore_data":{
         "sodium_points":0,
         "saturated_fat_points":0,
         "fiber_points":0,
         "energy_value":0,
         "fiber_value":0,
         "sugars_points":0,
         "sodium":0,
         "fruits_vegetables_nuts_colza_walnut_olive_oils":0,
         "fruits_vegetables_nuts_colza_walnut_olive_oils_value":0,
         "is_cheese":0,
         "sodium_value":0,
         "is_water":"1",
         "sugars":0,
         "proteins_value":0,
         "saturated_fat_ratio_value":0,
         "proteins":0,
         "is_fat":0,
         "negative_points":0,
         "saturated_fat_ratio_points":0,
         "fiber":0,
         "score":0,
         "saturated_fat":0,
         "saturated_fat_value":0,
         "energy":0,
         "energy_points":0,
         "grade":"a",
         "fruits_vegetables_nuts_colza_walnut_olive_oils_points":0,
         "positive_points":0,
         "sugars_value":0,
         "saturated_fat_ratio":0,
         "is_beverage":1,
         "proteins_points":0
      },
      "last_modified_by":"tacite-mass-editor",
      "additives_tags":[
         
      ],
      "data_sources_tags":[
         "app-elcoco",
         "app-yuka",
         "apps"
      ],
      "nova_group_debug":"",
      "nutrition_grade_fr":"a",
      "data_quality_errors_tags":[
         
      ],
      "minerals_prev_tags":[
         
      ],
      "amino_acids_tags":[
         
      ],
      "ciqual_food_name_tags":[
         "water-mineral-bottled-average"
      ],
      "states_tags":[
         "en:to-be-completed",
         "en:nutrition-facts-completed",
         "en:ingredients-to-be-completed",
         "en:expiration-date-to-be-completed",
         "en:packaging-code-to-be-completed",
         "en:characteristics-to-be-completed",
         "en:categories-completed",
         "en:brands-to-be-completed",
         "en:packaging-to-be-completed",
         "en:quantity-completed",
         "en:product-name-completed",
         "en:photos-validated",
         "en:photos-uploaded"
      ],
      "selected_images":{
         "nutrition":{
            "display":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/nutrition_fr.13.400.jpg"
            },
            "thumb":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/nutrition_fr.13.100.jpg"
            },
            "small":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/nutrition_fr.13.200.jpg"
            }
         },
         "front":{
            "small":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.200.jpg"
            },
            "thumb":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.100.jpg"
            },
            "display":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.400.jpg"
            }
         },
         "ingredients":{
            "display":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/ingredients_fr.7.400.jpg"
            },
            "small":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/ingredients_fr.7.200.jpg"
            },
            "thumb":{
               "fr":"https://static.openfoodfacts.org/images/products/841/338/401/0008/ingredients_fr.7.100.jpg"
            }
         }
      },
      "product_name_fr":"Agua Mineral Veri 33 cl",
      "languages_codes":{
         "fr":4
      },
      "image_nutrition_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/nutrition_fr.13.400.jpg",
      "ingredients_from_palm_oil_tags":[
         
      ],
      "last_modified_t":1586001409,
      "image_ingredients_thumb_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/ingredients_fr.7.100.jpg",
      "image_thumb_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/front_fr.4.100.jpg",
      "photographers_tags":[
         "kiliweb"
      ],
      "image_nutrition_thumb_url":"https://static.openfoodfacts.org/images/products/841/338/401/0008/nutrition_fr.13.100.jpg",
      "countries_lc":"en",
      "ingredients_ids_debug":[
         
      ],
      "traces":"",
      "languages":{
         "en:french":4
      },
      "states":"en:to-be-completed, en:nutrition-facts-completed, en:ingredients-to-be-completed, en:expiration-date-to-be-completed, en:packaging-code-to-be-completed, en:characteristics-to-be-completed, en:categories-completed, en:brands-to-be-completed, en:packaging-to-be-completed, en:quantity-completed, en:product-name-completed, en:photos-validated, en:photos-uploaded",
      "nucleotides_tags":[
         
      ],
      "traces_from_user":"(fr) ",
      "additives_debug_tags":[
         
      ],
      "lang":"fr",
      "quantity":"33 CL",
      "codes_tags":[
         "code-13",
         "8413384010xxx",
         "841338401xxxx",
         "84133840xxxxx",
         "8413384xxxxxx",
         "841338xxxxxxx",
         "84133xxxxxxxx",
         "8413xxxxxxxxx",
         "841xxxxxxxxxx",
         "84xxxxxxxxxxx",
         "8xxxxxxxxxxxx"
      ],
      "pnns_groups_2_tags":[
         "waters-and-flavored-waters",
         "known"
      ],
      "data_sources":"App - elcoco, App - yuka, Apps",
      "id":"8413384010008",
      "pnns_groups_1_tags":[
         "beverages",
         "known"
      ],
      "interface_version_created":"20150316.jqm2",
      "additives_prev_original_tags":[
         
      ]
   },
   "status_verbose":"product found"
}
 
 
  */
}
