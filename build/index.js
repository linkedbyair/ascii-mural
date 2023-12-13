(()=>{var r=class{constructor(n,e){this.name=n,this.symbols=e}getSymbol(n){return this.symbols.map(e=>(e.delta=Math.abs(e.luminance-n),e)).sort((e,c)=>e.delta-c.delta)[0]}};var O=new r("clocks",[{name:"clock_loader_90",luminance:0,style:"sharp"},{name:"clock_loader_60",luminance:68,style:"sharp"},{name:"clock_loader_40",luminance:145,style:"sharp"},{name:"lens",luminance:255,style:"sharp"}]);var L=new r("communication",[{name:"domain_disabled",luminance:0},{name:"contacts",luminance:0},{name:"contact_phone",luminance:13},{name:"business",luminance:17},{name:"contact_mail",luminance:17},{name:"forum",luminance:30},{name:"qr_code_2",luminance:34},{name:"hourglass_top",luminance:38},{name:"contact_emergency",luminance:38},{name:"hourglass_bottom",luminance:43},{name:"unsubscribe",luminance:47},{name:"comments_disabled",luminance:47},{name:"stop_screen_share",luminance:51},{name:"comment",luminance:55},{name:"qr_code",luminance:60},{name:"invert_colors_off",luminance:64},{name:"mark_unread_chat_alt",luminance:64},{name:"hub",luminance:68},{name:"message",luminance:68},{name:"chat",luminance:68},{name:"cell_wifi",luminance:72},{name:"domain_verification",luminance:77},{name:"phonelink_lock",luminance:77},{name:"co_present",luminance:77},{name:"document_scanner",luminance:77},{name:"duo",luminance:81},{name:"mobile_screen_share",luminance:81},{name:"print_disabled",luminance:81},{name:"screen_share",luminance:81},{name:"stay_primary_portrait",luminance:85},{name:"sip",luminance:89},{name:"qr_code_scanner",luminance:94},{name:"desktop_access_disabled",luminance:94},{name:"phonelink_erase",luminance:98},{name:"phonelink_ring",luminance:98},{name:"phonelink_setup",luminance:98},{name:"mail_lock",luminance:98},{name:"3p",luminance:106},{name:"stay_current_portrait",luminance:111},{name:"stay_current_landscape",luminance:111},{name:"stay_primary_landscape",luminance:111},{name:"portable_wifi_off",luminance:115},{name:"cancel_presentation",luminance:115},{name:"list_alt",luminance:115},{name:"no_sim",luminance:123},{name:"mark_email_unread",luminance:123},{name:"forward_to_inbox",luminance:123},{name:"mail_outline",luminance:123},{name:"alternate_email",luminance:123},{name:"send_time_extension",luminance:123},{name:"email",luminance:123},{name:"person_add_disabled",luminance:128},{name:"pause_presentation",luminance:128},{name:"live_help",luminance:128},{name:"rtt",luminance:132},{name:"present_to_all",luminance:132},{name:"mark_email_read",luminance:136},{name:"cell_tower",luminance:140},{name:"import_contacts",luminance:140},{name:"textsms",luminance:145},{name:"location_off",luminance:149},{name:"sentiment_satisfied_alt",luminance:149},{name:"mark_chat_unread",luminance:149},{name:"key_off",luminance:153},{name:"vpn_key_off",luminance:153},{name:"phone_disabled",luminance:162},{name:"chat_bubble_outline",luminance:162},{name:"chat_bubble",luminance:162},{name:"wifi_calling",luminance:166},{name:"vpn_key",luminance:166},{name:"rss_feed",luminance:166},{name:"more_time",luminance:166},{name:"mark_chat_read",luminance:170},{name:"nat",luminance:174},{name:"dialpad",luminance:174},{name:"dialer_sip",luminance:179},{name:"person_search",luminance:179},{name:"swap_calls",luminance:179},{name:"add_ic_call",luminance:183},{name:"speaker_phone",luminance:183},{name:"app_registration",luminance:183},{name:"key",luminance:183},{name:"location_on",luminance:196},{name:"ring_volume",luminance:196},{name:"spoke",luminance:196},{name:"voicemail",luminance:204},{name:"phone",luminance:221},{name:"phone_enabled",luminance:221},{name:"call",luminance:221},{name:"read_more",luminance:234},{name:"call_end",luminance:234},{name:"clear_all",luminance:234},{name:"call_split",luminance:238},{name:"call_made",luminance:242},{name:"call_received",luminance:242},{name:"call_missed_outgoing",luminance:242},{name:"import_export",luminance:242},{name:"call_missed",luminance:255},{name:"call_merge",luminance:255}]);var j=new r("maps",[{name:"streetview",luminance:0},{name:"set_meal",luminance:66},{name:"family_restroom",luminance:66},{name:"subway",luminance:73},{name:"railway_alert",luminance:78},{name:"trip_origin",luminance:86},{name:"apartment",luminance:86},{name:"bus_alert",luminance:91},{name:"departure_board",luminance:93},{name:"festival",luminance:96},{name:"taxi_alert",luminance:98},{name:"synagogue",luminance:98},{name:"kebab_dining",luminance:104},{name:"tire_repair",luminance:106},{name:"fire_truck",luminance:106},{name:"money",luminance:109},{name:"mosque",luminance:109},{name:"local_convenience_store",luminance:111},{name:"electric_rickshaw",luminance:114},{name:"corporate_fare",luminance:114},{name:"fort",luminance:114},{name:"directions_subway_filled",luminance:116},{name:"directions_transit_filled",luminance:116},{name:"hot_tub",luminance:116},{name:"directions_subway",luminance:116},{name:"directions_transit",luminance:116},{name:"local_laundry_service",luminance:116},{name:"tapas",luminance:116},{name:"hvac",luminance:116},{name:"no_food",luminance:116},{name:"directions_boat",luminance:116},{name:"directions_boat_filled",luminance:116},{name:"lunch_dining",luminance:119},{name:"sailing",luminance:119},{name:"balcony",luminance:119},{name:"cabin",luminance:121},{name:"local_movies",luminance:121},{name:"car_crash",luminance:121},{name:"elevator",luminance:121},{name:"person_pin",luminance:124},{name:"tram",luminance:124},{name:"liquor",luminance:124},{name:"local_see",luminance:124},{name:"forest",luminance:126},{name:"no_transfer",luminance:126},{name:"local_florist",luminance:126},{name:"rate_review",luminance:126},{name:"local_post_office",luminance:126},{name:"attractions",luminance:129},{name:"fire_extinguisher",luminance:129},{name:"emergency_recording",luminance:129},{name:"temple_buddhist",luminance:129},{name:"business_center",luminance:129},{name:"no_photography",luminance:129},{name:"directions_railway_filled",luminance:131},{name:"dinner_dining",luminance:131},{name:"escalator_warning",luminance:131},{name:"fence",luminance:131},{name:"design_services",luminance:131},{name:"crisis_alert",luminance:131},{name:"charging_station",luminance:131},{name:"directions_railway",luminance:131},{name:"temple_hindu",luminance:131},{name:"gite",luminance:134},{name:"handyman",luminance:134},{name:"electric_bike",luminance:134},{name:"storefront",luminance:134},{name:"train",luminance:134},{name:"local_car_wash",luminance:136},{name:"volunteer_activism",luminance:136},{name:"no_meals",luminance:136},{name:"safety_check",luminance:136},{name:"no_flash",luminance:136},{name:"do_not_touch",luminance:136},{name:"fastfood",luminance:136},{name:"stadium",luminance:136},{name:"medical_information",luminance:136},{name:"badge",luminance:136},{name:"castle",luminance:136},{name:"directions_bus",luminance:139},{name:"satellite",luminance:139},{name:"airport_shuttle",luminance:139},{name:"directions_bus_filled",luminance:139},{name:"local_drink",luminance:139},{name:"home_repair_service",luminance:139},{name:"rice_bowl",luminance:139},{name:"factory",luminance:139},{name:"microwave",luminance:141},{name:"minor_crash",luminance:141},{name:"local_printshop",luminance:141},{name:"escalator",luminance:141},{name:"electric_car",luminance:144},{name:"no_backpack",luminance:144},{name:"museum",luminance:144},{name:"traffic",luminance:144},{name:"bathtub",luminance:144},{name:"medical_services",luminance:144},{name:"ev_station",luminance:146},{name:"add_business",luminance:146},{name:"no_crash",luminance:146},{name:"local_hospital",luminance:146},{name:"menu_book",luminance:146},{name:"diamond",luminance:149},{name:"pedal_bike",luminance:149},{name:"restaurant",luminance:149},{name:"local_taxi",luminance:149},{name:"do_not_step",luminance:149},{name:"local_gas_station",luminance:149},{name:"map",luminance:149},{name:"wheelchair_pickup",luminance:151},{name:"local_atm",luminance:151},{name:"theater_comedy",luminance:151},{name:"ramen_dining",luminance:151},{name:"local_shipping",luminance:151},{name:"stairs",luminance:151},{name:"local_mall",luminance:151},{name:"breakfast_dining",luminance:151},{name:"ac_unit",luminance:154},{name:"layers_clear",luminance:154},{name:"holiday_village",luminance:154},{name:"warehouse",luminance:154},{name:"kitchen",luminance:154},{name:"bakery_dining",luminance:157},{name:"brunch_dining",luminance:157},{name:"bike_scooter",luminance:157},{name:"cleaning_services",luminance:157},{name:"store_mall_directory",luminance:157},{name:"countertops",luminance:157},{name:"no_stroller",luminance:159},{name:"dry",luminance:159},{name:"soap",luminance:159},{name:"car_rental",luminance:159},{name:"directions_bike",luminance:159},{name:"rv_hookup",luminance:159},{name:"agriculture",luminance:159},{name:"two_wheeler",luminance:159},{name:"emergency",luminance:159},{name:"night_shelter",luminance:159},{name:"signpost",luminance:159},{name:"bento",luminance:159},{name:"local_activity",luminance:159},{name:"local_play",luminance:159},{name:"vape_free",luminance:162},{name:"no_meeting_room",luminance:162},{name:"smoke_free",luminance:162},{name:"plumbing",luminance:162},{name:"wash",luminance:162},{name:"local_parking",luminance:162},{name:"baby_changing_station",luminance:162},{name:"directions_car",luminance:162},{name:"snowmobile",luminance:162},{name:"directions_car_filled",luminance:162},{name:"local_pharmacy",luminance:162},{name:"transfer_within_a_station",luminance:164},{name:"sports_bar",luminance:164},{name:"my_location",luminance:164},{name:"villa",luminance:164},{name:"church",luminance:164},{name:"casino",luminance:164},{name:"maps_ugc",luminance:164},{name:"spa",luminance:167},{name:"egg_alt",luminance:167},{name:"car_repair",luminance:167},{name:"pool",luminance:167},{name:"room_preferences",luminance:167},{name:"backpack",luminance:167},{name:"grass",luminance:169},{name:"nightlife",luminance:169},{name:"house",luminance:169},{name:"pest_control",luminance:169},{name:"meeting_room",luminance:169},{name:"food_bank",luminance:169},{name:"free_breakfast",luminance:169},{name:"local_cafe",luminance:169},{name:"no_drinks",luminance:172},{name:"local_dining",luminance:172},{name:"restaurant_menu",luminance:172},{name:"house_siding",luminance:172},{name:"electric_moped",luminance:172},{name:"hotel",luminance:172},{name:"local_hotel",luminance:172},{name:"local_grocery_store",luminance:174},{name:"cottage",luminance:174},{name:"child_care",luminance:174},{name:"route",luminance:174},{name:"hardware",luminance:174},{name:"local_library",luminance:174},{name:"run_circle",luminance:174},{name:"category",luminance:177},{name:"sos",luminance:177},{name:"foundation",luminance:177},{name:"hail",luminance:177},{name:"beach_access",luminance:177},{name:"dry_cleaning",luminance:177},{name:"beenhere",luminance:177},{name:"tty",luminance:179},{name:"houseboat",luminance:179},{name:"crib",luminance:179},{name:"person_pin_circle",luminance:182},{name:"pest_control_rodent",luminance:182},{name:"local_police",luminance:182},{name:"local_bar",luminance:182},{name:"near_me_disabled",luminance:182},{name:"takeout_dining",luminance:182},{name:"directions",luminance:182},{name:"stroller",luminance:184},{name:"local_fire_department",luminance:184},{name:"room_service",luminance:184},{name:"child_friendly",luminance:184},{name:"flight",luminance:184},{name:"screen_rotation_alt",luminance:184},{name:"other_houses",luminance:184},{name:"local_airport",luminance:184},{name:"compass_calibration",luminance:187},{name:"icecream",luminance:187},{name:"soup_kitchen",luminance:189},{name:"park",luminance:189},{name:"emergency_share",luminance:189},{name:"airlines",luminance:189},{name:"zoom_out_map",luminance:189},{name:"zoom_in_map",luminance:189},{name:"local_offer",luminance:189},{name:"add_location",luminance:189},{name:"edit_road",luminance:192},{name:"desk",luminance:192},{name:"electric_scooter",luminance:192},{name:"directions_run",luminance:194},{name:"mode_of_travel",luminance:194},{name:"not_listed_location",luminance:194},{name:"layers",luminance:194},{name:"wrong_location",luminance:194},{name:"electrical_services",luminance:194},{name:"add_location_alt",luminance:194},{name:"directions_walk",luminance:194},{name:"celebration",luminance:194},{name:"iron",luminance:194},{name:"pin_drop",luminance:194},{name:"water_damage",luminance:194},{name:"wine_bar",luminance:197},{name:"local_pizza",luminance:199},{name:"edit_location",luminance:199},{name:"umbrella",luminance:199},{name:"all_inclusive",luminance:199},{name:"chalet",luminance:199},{name:"carpenter",luminance:199},{name:"edit_location_alt",luminance:199},{name:"vaping_rooms",luminance:202},{name:"smoking_rooms",luminance:202},{name:"location_pin",luminance:202},{name:"place",luminance:202},{name:"fitness_center",luminance:202},{name:"flight_class",luminance:202},{name:"bungalow",luminance:205},{name:"checkroom",luminance:205},{name:"terrain",luminance:210},{name:"navigation",luminance:210},{name:"edit_attributes",luminance:210},{name:"near_me",luminance:212},{name:"golf_course",luminance:212},{name:"remove_road",luminance:212},{name:"add_road",luminance:212},{name:"transit_enterexit",luminance:215},{name:"alt_route",luminance:217},{name:"local_phone",luminance:217},{name:"360",luminance:220},{name:"u_turn_left",luminance:220},{name:"roofing",luminance:220},{name:"fork_left",luminance:222},{name:"airline_stops",luminance:222},{name:"u_turn_right",luminance:222},{name:"atm",luminance:225},{name:"multiple_stop",luminance:227},{name:"fork_right",luminance:227},{name:"connecting_airports",luminance:235},{name:"egg",luminance:235},{name:"moving",luminance:237},{name:"turn_sharp_left",luminance:237},{name:"turn_sharp_right",luminance:237},{name:"merge",luminance:237},{name:"ramp_right",luminance:240},{name:"turn_left",luminance:245},{name:"turn_right",luminance:245},{name:"turn_slight_right",luminance:247},{name:"ramp_left",luminance:247},{name:"turn_slight_left",luminance:250},{name:"straight",luminance:255}]);var B=new r("social",[{name:"face_2",luminance:0},{name:"wallet",luminance:17},{name:"face_3",luminance:28},{name:"public_off",luminance:38},{name:"public",luminance:38},{name:"diversity_3",luminance:52},{name:"compost",luminance:55},{name:"domain_add",luminance:59},{name:"location_city",luminance:59},{name:"domain",luminance:59},{name:"piano_off",luminance:62},{name:"piano",luminance:65},{name:"switch_account",luminance:65},{name:"fireplace",luminance:69},{name:"sports_basketball",luminance:76},{name:"sports_volleyball",luminance:79},{name:"diversity_1",luminance:79},{name:"recommend",luminance:79},{name:"sports_kabaddi",luminance:86},{name:"sports_soccer",luminance:86},{name:"diversity_2",luminance:86},{name:"scoreboard",luminance:86},{name:"paragliding",luminance:90},{name:"south_america",luminance:90},{name:"follow_the_signs",luminance:90},{name:"travel_explore",luminance:90},{name:"landslide",luminance:90},{name:"recycling",luminance:93},{name:"sports_rugby",luminance:96},{name:"surfing",luminance:103},{name:"face_4",luminance:103},{name:"scale",luminance:103},{name:"group_off",luminance:107},{name:"hive",luminance:107},{name:"group_add",luminance:110},{name:"clean_hands",luminance:110},{name:"real_estate_agent",luminance:114},{name:"emoji_food_beverage",luminance:114},{name:"sign_language",luminance:114},{name:"roller_skating",luminance:114},{name:"kitesurfing",luminance:117},{name:"interests",luminance:117},{name:"kayaking",luminance:121},{name:"group_remove",luminance:121},{name:"handshake",luminance:121},{name:"flood",luminance:124},{name:"cyclone",luminance:124},{name:"no_luggage",luminance:124},{name:"waving_hand",luminance:128},{name:"people_outline",luminance:131},{name:"heart_broken",luminance:131},{name:"reduce_capacity",luminance:131},{name:"group",luminance:131},{name:"people",luminance:131},{name:"people_alt",luminance:131},{name:"tsunami",luminance:134},{name:"facebook",luminance:134},{name:"sentiment_very_dissatisfied",luminance:134},{name:"history_edu",luminance:134},{name:"vaccines",luminance:134},{name:"pages",luminance:134},{name:"emoji_transportation",luminance:138},{name:"add_reaction",luminance:138},{name:"no_adult_content",luminance:138},{name:"poll",luminance:138},{name:"18_up_rating",luminance:138},{name:"face_6",luminance:141},{name:"sports_baseball",luminance:141},{name:"sports",luminance:141},{name:"sports_mma",luminance:141},{name:"ice_skating",luminance:141},{name:"engineering",luminance:145},{name:"sports_football",luminance:145},{name:"emoji_emotions",luminance:145},{name:"mood",luminance:145},{name:"emoji_symbols",luminance:145},{name:"sentiment_very_satisfied",luminance:145},{name:"deck",luminance:145},{name:"front_hand",luminance:145},{name:"add_moderator",luminance:145},{name:"sick",luminance:148},{name:"mood_bad",luminance:148},{name:"groups_2",luminance:148},{name:"workspace_premium",luminance:148},{name:"sanitizer",luminance:148},{name:"thumb_down_alt",luminance:148},{name:"thumb_up_alt",luminance:148},{name:"party_mode",luminance:148},{name:"emoji_nature",luminance:152},{name:"precision_manufacturing",luminance:152},{name:"cruelty_free",luminance:152},{name:"luggage",luminance:152},{name:"pix",luminance:152},{name:"nights_stay",luminance:155},{name:"elderly_woman",luminance:155},{name:"transgender",luminance:155},{name:"school",luminance:155},{name:"construction",luminance:159},{name:"tornado",luminance:159},{name:"king_bed",luminance:159},{name:"back_hand",luminance:159},{name:"severe_cold",luminance:162},{name:"personal_injury",luminance:162},{name:"whatshot",luminance:162},{name:"cake",luminance:162},{name:"face_5",luminance:162},{name:"edit_notifications",luminance:162},{name:"sledding",luminance:165},{name:"sports_motorsports",luminance:165},{name:"6_ft_apart",luminance:165},{name:"ios_share",luminance:165},{name:"sentiment_satisfied",luminance:165},{name:"sentiment_dissatisfied",luminance:165},{name:"psychology",luminance:165},{name:"hiking",luminance:169},{name:"nordic_walking",luminance:169},{name:"skateboarding",luminance:169},{name:"notifications_active",luminance:169},{name:"groups",luminance:169},{name:"remove_moderator",luminance:169},{name:"snowboarding",luminance:172},{name:"notifications_off",luminance:172},{name:"sports_esports",luminance:172},{name:"social_distance",luminance:172},{name:"sports_martial_arts",luminance:172},{name:"thunderstorm",luminance:172},{name:"sports_tennis",luminance:172},{name:"cookie",luminance:172},{name:"groups_3",luminance:172},{name:"notifications_paused",luminance:172},{name:"person_add",luminance:176},{name:"self_improvement",luminance:176},{name:"sentiment_neutral",luminance:176},{name:"emoji_events",luminance:176},{name:"psychology_alt",luminance:176},{name:"health_and_safety",luminance:176},{name:"sports_handball",luminance:179},{name:"elderly",luminance:179},{name:"coronavirus",luminance:179},{name:"outdoor_grill",luminance:179},{name:"blind",luminance:183},{name:"snowshoeing",luminance:183},{name:"emoji_objects",luminance:183},{name:"emoji_people",luminance:183},{name:"assist_walker",luminance:186},{name:"single_bed",luminance:186},{name:"connect_without_contact",luminance:186},{name:"sports_hockey",luminance:186},{name:"volcano",luminance:186},{name:"person_3",luminance:190},{name:"military_tech",luminance:190},{name:"science",luminance:190},{name:"downhill_skiing",luminance:193},{name:"person_off",luminance:193},{name:"notification_add",luminance:193},{name:"dew_point",luminance:193},{name:"scuba_diving",luminance:196},{name:"person_remove",luminance:196},{name:"person_4",luminance:196},{name:"sports_gymnastics",luminance:196},{name:"person_2",luminance:200},{name:"sports_golf",luminance:200},{name:"man_2",luminance:203},{name:"man_3",luminance:203},{name:"notifications_none",luminance:203},{name:"man",luminance:203},{name:"notifications",luminance:203},{name:"woman",luminance:207},{name:"man_4",luminance:207},{name:"water_drop",luminance:207},{name:"emoji_flags",luminance:207},{name:"share",luminance:207},{name:"person_outline",luminance:210},{name:"person",luminance:210},{name:"woman_2",luminance:210},{name:"sports_cricket",luminance:210},{name:"safety_divider",luminance:217},{name:"masks",luminance:217},{name:"male",luminance:224},{name:"co2",luminance:241},{name:"female",luminance:241},{name:"architecture",luminance:248},{name:"plus_one",luminance:248},{name:"boy",luminance:248},{name:"girl",luminance:255}]);var A=new r("weather",[{name:"landslide",luminance:0},{name:"mode_dual",luminance:41},{name:"cyclone",luminance:41},{name:"flood",luminance:41},{name:"tsunami",luminance:53},{name:"ac_unit",luminance:58},{name:"storm",luminance:62},{name:"nights_stay",luminance:78},{name:"tornado",luminance:82},{name:"severe_cold",luminance:86},{name:"foggy",luminance:86},{name:"air",luminance:95},{name:"partly_cloudy_day",luminance:95},{name:"thunderstorm",luminance:99},{name:"routine",luminance:99},{name:"rainy",luminance:111},{name:"clear_day",luminance:115},{name:"sunny",luminance:115},{name:"water",luminance:119},{name:"weather_hail",luminance:128},{name:"weather_mix",luminance:128},{name:"weather_snowy",luminance:128},{name:"heat",luminance:132},{name:"rainy_heavy",luminance:132},{name:"clear_night",luminance:132},{name:"cloud",luminance:132},{name:"airwave",luminance:136},{name:"cloudy_snowing",luminance:136},{name:"mist",luminance:144},{name:"rainy_light",luminance:160},{name:"sunny_snowing",luminance:169},{name:"rainy_snow",luminance:173},{name:"snowing_heavy",luminance:255}]);var k={FULL_COLOR:"fullcolor",GRAYSCALE:"grayscale",BLACK_AND_WHITE:"blackandwhite"},C=[700,600,500,400,300,200,100];function D(a={},{red:n,green:e,blue:c}){return`rgb(${n}, ${e}, ${c})`}function W(a={},{luminance:n}){return`rgb(${n}, ${n}, ${n})`}function G(a={},{luminance:n}){return"black"}var R={default:D,[k.FULL_COLOR]:D,[k.GRAYSCALE]:W,[k.BLACK_AND_WHITE]:G};function P(a){return new Promise((n,e)=>{let c=new Image,o=new FileReader;o.onload=u=>{c.src=u.target.result},c.onload=()=>{n(c)},o.onerror=e,o.readAsDataURL(a)})}function N({image:a,size:n}){n||={},n.width||=a.width,n.height||=a.height;let e=document.createElement("canvas"),c=e.getContext("2d");e.width=n.width,e.height=n.height,c.drawImage(a,0,0,n.width,n.height);let o=c.getImageData(0,0,n.width,n.height);if(!o||!o.data)throw new Error("Could not get image data");return o.data.reduce((u,m,i)=>{let t=Math.floor(i/4);return u[t]||(u[t]=[]),u[t].push(m),u},[]).map(u=>{let[m,i,t]=u,_=.2126*m+.7152*i+.0722*t,p=`rgb(${m}, ${i}, ${t})`,b=C[Math.floor(_/255*(C.length-1))],h=Math.floor(_/255*50)+"%";return{red:m,green:i,blue:t,luminance:_,color:p,weight:b,radius:h}})}function K({pixel:a,settings:n={}}){let{threshold:e=128,symbolSet:c=L,colorMode:o=METHODS[FULL_COLOR],iconSize:u=12}=n,{luminance:m}=a,i=c.getSymbol(m),t=R[o].bind(null,n),_=m<e?"dark":"light",p=m>e/2?"fill":"outline",b=_==="light"?n.backgroundColor:t(a),h=_==="light"?t(a):n.backgroundColor,v=p==="fill"?1:0,x=a.luminance!==255,w=3/4*u,g;switch(i.style){case"sharp":g="material-symbols-sharp";case"round":g="material-symbols-round";default:g="material-symbols-outlined"}return`
  <span
    class='${g} shrink-0 flex justify-center items-center' 
    style="
      width: ${u||12}px;
      height: ${u||12}px;
      display: flex;
      font-size: ${w}px;
      background-color: ${b};
      color: ${h};
      font-variation-settings: 'wght' ${a.weight}, 'FILL_color' ${v};
      border-radius: ${a.radius}
    "
  >
    ${x?i.name:""}
  </span>`}function Y({pixels:a,size:n,...e}){return Array.from({length:n.height}).map((c,o)=>`<div class="flex flex-row no-wrap">${Array.from({length:n.width}).map((m,i)=>{let t=o*n.width+i;return K({pixel:a[t],settings:e})}).join("")}</div>`).join("")}function J(){let a=document.getElementById("image"),n=document.getElementById("threshold"),e=document.getElementById("symbol-set"),c=document.getElementById("output"),o=document.getElementById("errors"),u=document.getElementById("clear-errors"),m=document.getElementById("width"),i=document.getElementById("height"),t=document.getElementById("color-mode"),_=document.getElementById("background-color"),p=document.getElementById("icon-size"),b=[n,e,t,_,p],h=l=>{o.innerHTML+=l.message},v=()=>{o.innerHTML=""},x=l=>{switch(l){case"clocks":return O;case"communication":return L;case"maps":return j;case"social":return B;default:return A}},w=(l,f={})=>{if(f.target&&f.target===i){let s=parseInt(i.value,10),d=Math.floor(s*(l.width/l.height));m.value!==d&&(m.value=d)}else{let s=parseInt(m.value,10),d=Math.floor(s*(l.height/l.width));i.value!==d&&(i.value=d)}},g=()=>({width:parseInt(m.value,10),height:parseInt(i.value,10)}),E=[],H=()=>{E.forEach(l=>l()),E=[]},I=[],$=()=>{I.forEach(l=>l()),I=[]},T=async()=>{H(),$();let l;try{l=await P(a.files[0])}catch(s){return console.error(s),h(s)}w(l,{target:m});let f=s=>{$(),w(l,s);let d=g(),U=N({image:l,size:d}),S=()=>{try{let y=n.value,z=x(e.value),F=t.value,M=_.value,q=p.value;c.innerHTML=Y({pixels:U,size:d,threshold:y,symbolSet:z,colorMode:F,backgroundColor:M,iconSize:q}),c.style.backgroundColor=M}catch(y){return h(y)}};I=b.map(y=>(y.addEventListener("change",S),()=>{y.removeEventListener("change",S)})),S()};[m,i].forEach(s=>{s.addEventListener("change",f),E.push(()=>s.removeEventListener("change",f))}),f()};u.addEventListener("click",v),a.addEventListener("change",T)}document.addEventListener("DOMContentLoaded",J);})();
//# sourceMappingURL=index.js.map
