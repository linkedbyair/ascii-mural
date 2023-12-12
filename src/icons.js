import * as htmlToImage from "html-to-image";

const weather = {
  name: "weather",
  symbols: [
    `ac_unit`,
    `severe_cold`,
    `mode_dual`,
    `storm`,
    `cyclone`,
    `flood`,
    `air `,
    `landslide`,
    `airwave`,
    `heat `,
    `rainy_heavy`,
    `mist `,
    `tornado `,
    `rainy_light `,
    `tsunami `,
    `rainy_snow `,
    `water `,
    `nights_stay `,
    `foggy `,
    `thunderstorm `,
    `weather_hail `,
    `weather_mix `,
    `weather_snowy `,
    `cloudy_snowing `,
    `routine `,
    `partly_cloudy_day `,
    `rainy `,
    `clear_day `,
    `sunny `,
    `sunny_snowing `,
    `snowing_heavy `,
    `clear_night `,
    `cloud `,
  ],
};
const communication = {
  name: "communication",
  symbols: [
    "call_made",
    "call_received",
    "call_missed",
    "call_missed_outgoing",
    "read_more",
    "call_end",
    "phone",
    "phone_enabled",
    "call",
    "call_merge",
    "import_export",
    "dialer_sip",
    "add_ic_call",
    "key_off",
    "person_search",
    "phone_disabled",
    "call_split",
    "wifi_calling",
    "phonelink_erase",
    "vpn_key_off",
    "vpn_key",
    "invert_colors_off",
    "qr_code_scanner",
    "clear_all",
    "location_off",
    "location_on",
    "person_add_disabled",
    "qr_code_2",
    "speaker_phone",
    "no_sim",
    "nat",
    "domain_disabled",
    "swap_calls",
    "rss_feed",
    "dialpad",
    "app_registration",
    "more_time",
    "ring_volume",
    "mark_unread_chat_alt",
    "voicemail",
    "key",
    "chat_bubble_outline",
    "mark_email_unread",
    "duo",
    "sentiment_satisfied_alt",
    "cell_tower",
    "rtt",
    "spoke",
    "forward_to_inbox",
    "mail_outline",
    "cell_wifi",
    "portable_wifi_off",
    "phonelink_ring",
    "alternate_email",
    "hourglass_bottom",
    "hourglass_top",
    "stay_current_portrait",
    "stay_primary_portrait",
    "stay_current_landscape",
    "stay_primary_landscape",
    "domain_verification",
    "pause_presentation",
    "cancel_presentation",
    "present_to_all",
    "list_alt",
    "qr_code",
    "phonelink_lock",
    "mobile_screen_share",
    "desktop_access_disabled",
    "phonelink_setup",
    "hub",
    "unsubscribe",
    "business",
    "send_time_extension",
    "print_disabled",
    "co_present",
    "import_contacts",
    "mark_email_read",
    "comments_disabled",
    "document_scanner",
    "comment",
    "message",
    "forum",
    "sip",
    "chat",
    "mail_lock",
    "stop_screen_share",
    "mark_chat_read",
    "email",
    "3p",
    "live_help",
    "screen_share",
    "mark_chat_unread",
    "textsms",
    "contact_mail",
    "chat_bubble",
    "contacts",
    "contact_phone",
    "contact_emergency",
  ],
};
const maps = {
  name: "maps",
  symbols: [
    `connecting_airports`,
    `alt_route`,
    `transit_enterexit`,
    `360`,
    `straight`,
    `local_phone`,
    `vaping_rooms`,
    `turn_slight_left`,
    `turn_slight_right`,
    `smoking_rooms`,
    `grass`,
    `directions_run`,
    `turn_left`,
    `turn_right`,
    `mode_of_travel`,
    `multiple_stop`,
    `moving`,
    `near_me`,
    `terrain`,
    `ramp_right`,
    `ramp_left`,
    `navigation`,
    `vape_free`,
    `turn_sharp_left`,
    `turn_sharp_right`,
    `atm`,
    `merge`,
    `soup_kitchen`,
    `no_drinks`,
    `local_dining`,
    `restaurant_menu`,
    `transfer_within_a_station`,
    `bungalow`,
    `stroller`,
    `tty`,
    `person_pin_circle`,
    `no_stroller`,
    `local_fire_department`,
    `fork_left`,
    `fork_right`,
    `not_listed_location`,
    `airline_stops`,
    `room_service`,
    `pest_control_rodent`,
    `location_pin`,
    `u_turn_left`,
    `u_turn_right`,
    `layers`,
    `compass_calibration`,
    `local_pizza`,
    `park`,
    `emergency_share`,
    `attractions`,
    `place`,
    `bakery_dining`,
    `person_pin`,
    `egg`,
    `edit_location`,
    `category`,
    `golf_course`,
    `roofing`,
    `airlines`,
    `local_grocery_store`,
    `spa`,
    `electric_car`,
    `cabin`,
    `no_meeting_room`,
    `directions_bus`,
    `child_friendly`,
    `local_car_wash`,
    `set_meal`,
    `trip_origin`,
    `electric_rickshaw`,
    `remove_road`,
    `add_road`,
    `checkroom`,
    `corporate_fare`,
    `zoom_out_map`,
    `wrong_location`,
    `sports_bar`,
    `umbrella`,
    `electrical_services`,
    `all_inclusive`,
    `lunch_dining`,
    `edit_road`,
    `sailing`,
    `add_location_alt`,
    `directions_walk`,
    `fitness_center`,
    `flight_class`,
    `volunteer_activism`,
    `desk`,
    `flight`,
    `directions_subway_filled`,
    `directions_transit_filled`,
    `electric_scooter`,
    `directions_railway_filled`,
    `zoom_in_map`,
    `taxi_alert`,
    `screen_rotation_alt`,
    `bus_alert`,
    `other_houses`,
    `local_airport`,
    `smoke_free`,
    `no_backpack`,
    `egg_alt`,
    `local_movies`,
    `forest`,
    `satellite`,
    `museum`,
    `local_offer`,
    `chalet`,
    `cottage`,
    `wine_bar`,
    `plumbing`,
    `sos`,
    `local_police`,
    `railway_alert`,
    `dry`,
    `local_convenience_store`,
    `foundation`,
    `wash`,
    `soap`,
    `hail`,
    `house_siding`,
    `celebration`,
    `nightlife`,
    `local_bar`,
    `child_care`,
    `car_repair`,
    `carpenter`,
    `wheelchair_pickup`,
    `local_parking`,
    `route`,
    `hardware`,
    `baby_changing_station`,
    `near_me_disabled`,
    `car_rental`,
    `iron`,
    `pool`,
    `beach_access`,
    `brunch_dining`,
    `directions_bike`,
    `fire_extinguisher`,
    `electric_moped`,
    `pin_drop`,
    `dinner_dining`,
    `diamond`,
    `add_location`,
    `icecream`,
    `houseboat`,
    `dry_cleaning`,
    `bike_scooter`,
    `ac_unit`,
    `my_location`,
    `pedal_bike`,
    `local_atm`,
    `escalator_warning`,
    `layers_clear`,
    `rv_hookup`,
    `agriculture`,
    `gite`,
    `tram`,
    `edit_attributes`,
    `restaurant`,
    `two_wheeler`,
    `emergency`,
    `directions_car`,
    `no_meals`,
    `safety_check`,
    `cleaning_services`,
    `handyman`,
    `electric_bike`,
    `fence`,
    `house`,
    `snowmobile`,
    `pest_control`,
    `design_services`,
    `edit_location_alt`,
    `water_damage`,
    `crib`,
    `local_taxi`,
    `storefront`,
    `crisis_alert`,
    `airport_shuttle`,
    `traffic`,
    `do_not_step`,
    `directions_car_filled`,
    `no_transfer`,
    `takeout_dining`,
    `night_shelter`,
    `balcony`,
    `local_florist`,
    `charging_station`,
    `store_mall_directory`,
    `local_gas_station`,
    `directions`,
    `theater_comedy`,
    `signpost`,
    `hot_tub`,
    `ramen_dining`,
    `hotel`,
    `local_hotel`,
    `no_flash`,
    `meeting_room`,
    `villa`,
    `ev_station`,
    `room_preferences`,
    `countertops`,
    `food_bank`,
    `family_restroom`,
    `add_business`,
    `microwave`,
    `holiday_village`,
    `train`,
    `money`,
    `directions_subway`,
    `directions_transit`,
    `no_crash`,
    `map`,
    `liquor`,
    `directions_bus_filled`,
    `do_not_touch`,
    `car_crash`,
    `directions_railway`,
    `local_laundry_service`,
    `apartment`,
    `minor_crash`,
    `local_library`,
    `temple_hindu`,
    `local_drink`,
    `local_printshop`,
    `emergency_recording`,
    `bento`,
    `bathtub`,
    `home_repair_service`,
    `tapas`,
    `tire_repair`,
    `rice_bowl`,
    `hvac`,
    `church`,
    `kebab_dining`,
    `departure_board`,
    `local_hospital`,
    `fastfood`,
    `free_breakfast`,
    `local_cafe`,
    `warehouse`,
    `temple_buddhist`,
    `local_pharmacy`,
    `stadium`,
    `festival`,
    `business_center`,
    `fire_truck`,
    `local_activity`,
    `local_play`,
    `local_shipping`,
    `no_food`,
    `factory`,
    `elevator`,
    `backpack`,
    `no_photography`,
    `kitchen`,
    `escalator`,
    `synagogue`,
    `streetview`,
    `menu_book`,
    `directions_boat`,
    `directions_boat_filled`,
    `rate_review`,
    `stairs`,
    `medical_information`,
    `run_circle`,
    `badge`,
    `local_mall`,
    `local_post_office`,
    `casino`,
    `local_see`,
    `subway`,
    `breakfast_dining`,
    `castle`,
    `maps_ugc`,
    `beenhere`,
    `fort`,
    `mosque`,
    `medical_services`,
  ],
};
const social = {
  name: "social",
  symbols: [
    `woman`,
    `person_outline`,
    `scuba_diving`,
    `downhill_skiing`,
    `sports_handball`,
    `elderly`,
    `blind`,
    `snowshoeing`,
    `assist_walker`,
    `people_outline`,
    `co2`,
    `girl`,
    `person`,
    `architecture`,
    `plus_one`,
    `boy`,
    `hiking`,
    `snowboarding`,
    `nordic_walking`,
    `skateboarding`,
    `person_remove`,
    `emoji_nature`,
    `sledding`,
    `person_off`,
    `severe_cold`,
    `personal_injury`,
    `precision_manufacturing`,
    `female`,
    `person_2`,
    `recycling`,
    `person_add`,
    `nights_stay`,
    `person_4`,
    `whatshot`,
    `notifications_off`,
    `kayaking`,
    `engineering`,
    `kitesurfing`,
    `emoji_objects`,
    `woman_2`,
    `male`,
    `cruelty_free`,
    `person_3`,
    `coronavirus`,
    `group_remove`,
    `sports_basketball`,
    `surfing`,
    `face_6`,
    `notification_add`,
    `safety_divider`,
    `tsunami`,
    `group_add`,
    `man_2`,
    `sports_volleyball`,
    `man_3`,
    `sports_esports`,
    `man_4`,
    `notifications_none`,
    `sports_football`,
    `man`,
    `piano_off`,
    `notifications_active`,
    `clean_hands`,
    `water_drop`,
    `cake`,
    `interests`,
    `sports_motorsports`,
    `sports_gymnastics`,
    `emoji_flags`,
    `share`,
    `face_4`,
    `domain_add`,
    `sports_golf`,
    `heart_broken`,
    `flood`,
    `emoji_people`,
    `military_tech`,
    `real_estate_agent`,
    `self_improvement`,
    `social_distance`,
    `single_bed`,
    `paragliding`,
    `facebook`,
    `sports_baseball`,
    `sports_martial_arts`,
    `thunderstorm`,
    `connect_without_contact`,
    `emoji_transportation`,
    `sports_hockey`,
    `sports_tennis`,
    `elderly_woman`,
    `science`,
    `sports_cricket`,
    `6_ft_apart`,
    `sentiment_neutral`,
    `ios_share`,
    `sentiment_satisfied`,
    `sentiment_dissatisfied`,
    `emoji_emotions`,
    `sick`,
    `cookie`,
    `add_reaction`,
    `groups_3`,
    `groups`,
    `sports`,
    `remove_moderator`,
    `sentiment_very_dissatisfied`,
    `face_5`,
    `outdoor_grill`,
    `dew_point`,
    `transgender`,
    `notifications_paused`,
    `mood`,
    `mood_bad`,
    `construction`,
    `face_3`,
    `edit_notifications`,
    `emoji_symbols`,
    `groups_2`,
    `sentiment_very_satisfied`,
    `masks`,
    `no_adult_content`,
    `tornado`,
    `reduce_capacity`,
    `group`,
    `people`,
    `psychology`,
    `workspace_premium`,
    `deck`,
    `history_edu`,
    `cyclone`,
    `notifications`,
    `handshake`,
    `vaccines`,
    `south_america`,
    `sports_mma`,
    `follow_the_signs`,
    `compost`,
    `emoji_events`,
    `luggage`,
    `travel_explore`,
    `no_luggage`,
    `psychology_alt`,
    `king_bed`,
    `sports_kabaddi`,
    `people_alt`,
    `sports_soccer`,
    `group_off`,
    `scale`,
    `school`,
    `pages`,
    `public_off`,
    `sanitizer`,
    `emoji_food_beverage`,
    `health_and_safety`,
    `public`,
    `diversity_1`,
    `piano`,
    `location_city`,
    `pix`,
    `thumb_down_alt`,
    `thumb_up_alt`,
    `diversity_2`,
    `diversity_3`,
    `volcano`,
    `recommend`,
    `ice_skating`,
    `domain`,
    `hive`,
    `landslide`,
    `sports_rugby`,
    `wallet`,
    `fireplace`,
    `switch_account`,
    `sign_language`,
    `roller_skating`,
    `back_hand`,
    `front_hand`,
    `scoreboard`,
    `poll`,
    `add_moderator`,
    `18_up_rating`,
    `party_mode`,
    `waving_hand`,
    `face_2`,
  ],
};

function getIconHTML() {
  return [weather, communication, maps, social]
    .map((iconSet) => {
      const innerHTML = iconSet.symbols
        .map(
          (symbol) =>
            `<tr class="js-symbol">
        <td>
          <span class="js-symbol__name">${symbol}</span>
        </td>
        <td>
          <span
            class='material-symbols-outlined js-symbol__icon'
            data-character="${symbol}"
            style="
              background-color: white;
              color: black;
              font-variation-settings: 'wght' 700, 'FILL_color' 1;
            "
          >
            ${symbol}
          </span>
        </td>
        <td>
          <span class="js-symbol__luminance"></span>
        </td>
        <td>
          <span class="js-symbol__scaled-luminance"></span>
        </td>
      </tr>`
        )
        .join("");
      return `<section class="mb-8 js-section" data-section="${iconSet.name}">
      <details>
        <summary>
          <span class="text-2xl font-bold mb-4">${iconSet.name}</span>
        </summary>
        <div class="mt-2 mb-4">
          <button class="js-generate-images bg-[khaki] border border-black px-1 py-2 text-xs" data-section="${iconSet.name}">
            Get luminance
          </button>
          <button class="js-generate-scale bg-[khaki] border border-black px-1 py-2 text-xs" data-section="${iconSet.name}">
            Scale luminance
          </button>
          <button class="js-export bg-[khaki] border border-black px-1 py-2 text-xs" data-section="${iconSet.name}">
            Export symbol set
          </button>
        </div>
        <div class="mb-4 text-xs">
          <p>
            <span>Minimum luminance: </span>
            <span class="js-minimum-luminance"></span>
          </p>
          <p>
            <span>Maximum luminance: </span>
            <span class="js-maximum-luminance"></span>
          </p>
          <p>
            <span>Export output: </span>
            <textarea class="js-export-output border-1 border-black block w-full h-32"></textarea>
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th class="text-left font-normal text-xs">Name</th>
              <th class="text-left font-normal text-xs">Icon</th>
              <th class="text-left font-normal text-xs">Luminance</th>
              <th class="text-left font-normal text-xs">Luminance (scaled)</th>
            </tr>
          </thead>
          <tbody>
            ${innerHTML}
          </tbody>
        </table>
      </details>
    </section>`;
    })
    .join("");
}

function recordLuminanceValues(section) {
  const { symbols } = section;
  Object.values(symbols).forEach((elements) => {
    htmlToImage.toPixelData(elements.icon).then((data) => {
      const chunks = data.reduce((acc, value, index) => {
        const chunkIndex = Math.floor(index / 4);
        if (!acc[chunkIndex]) {
          acc[chunkIndex] = [];
        }
        acc[chunkIndex].push(value);
        return acc;
      }, []);
      const luminanceByPixel = chunks.map((chunk) => {
        const [r, g, b] = chunk;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      });
      const averageLuminance = Math.round(
        luminanceByPixel.reduce((acc, value) => acc + value, 0) /
          luminanceByPixel.length
      );
      elements.luminance.textContent = averageLuminance;
    });
  });
}

function scaleLuminanceValues(section) {
  const { symbols, minimumLuminance, maximumLuminance } = section;
  const luminanceValues = Object.values(symbols).map((symbol) =>
    parseFloat(symbol.luminance.textContent)
  );
  const minimumLuminanceValue = Math.min(...luminanceValues);
  const maximumLuminanceValue = Math.max(...luminanceValues);
  minimumLuminance.textContent = minimumLuminanceValue;
  maximumLuminance.textContent = maximumLuminanceValue;

  Object.values(symbols).forEach(({ luminance, scaledLuminance }) => {
    const luminanceValue = parseFloat(luminance.textContent);
    const scaledLuminanceValue =
      (luminanceValue - minimumLuminanceValue) /
      (maximumLuminanceValue - minimumLuminanceValue);
    const projectedLuminanceValue = Math.round(scaledLuminanceValue * 255);
    scaledLuminance.textContent = projectedLuminanceValue;
  });
}

function exportAsSymbolSet(name, section) {
  const sorted = Object.entries(section.symbols)
    .map(([name, symbol]) => {
      const scaledLuminance = parseFloat(symbol.scaledLuminance.textContent);
      return {
        name,
        luminance: scaledLuminance,
      };
    })
    .sort((a, b) => a.luminance - b.luminance);

  section.exportOutput.value = `
import { SymbolSet } from "./symbol-set.js";

export const ${name} = new SymbolSet("${name}", [
  ${sorted
    .map(
      (symbol) => `{ name: "${symbol.name}", luminance: ${symbol.luminance} }`
    )
    .join(",\n  ")}
]);
  `;
  console.log(sorted);
}

function initialize() {
  const canvas = document.getElementById("output");
  canvas.innerHTML = getIconHTML();
  const sections = [...document.querySelectorAll(".js-section")].reduce(
    (acc, section) => {
      const name = section.dataset.section;
      const symbols = [...section.querySelectorAll(".js-symbol")].reduce(
        (acc, element) => {
          const name = element
            .querySelector(".js-symbol__name")
            .textContent.trim();
          const icon = element.querySelector(".js-symbol__icon");
          const luminance = element.querySelector(".js-symbol__luminance");
          const scaledLuminance = element.querySelector(
            ".js-symbol__scaled-luminance"
          );
          acc[name] = { element, icon, luminance, scaledLuminance };
          return acc;
        },
        {}
      );
      const luminanceButton = section.querySelector(
        `.js-generate-images[data-section=${name}]`
      );
      const scaleButton = section.querySelector(
        `.js-generate-scale[data-section=${name}]`
      );
      const exportButton = section.querySelector(
        `.js-export[data-section=${name}]`
      );
      const minimumLuminance = section.querySelector(`.js-minimum-luminance`);
      const maximumLuminance = section.querySelector(`.js-maximum-luminance`);
      const exportOutput = section.querySelector(`.js-export-output`);
      acc[name] = {
        element: section,
        symbols,
        luminanceButton,
        scaleButton,
        exportButton,
        minimumLuminance,
        maximumLuminance,
        exportOutput,
      };
      return acc;
    },
    {}
  );

  console.log(sections);

  Object.entries(sections).forEach(([name, section]) => {
    const { luminanceButton, scaleButton, exportButton } = section;
    luminanceButton.addEventListener("click", () => {
      recordLuminanceValues(section);
    });
    scaleButton.addEventListener("click", () => {
      scaleLuminanceValues(section);
    });
    exportButton.addEventListener("click", () => {
      exportAsSymbolSet(name, section);
    });
  });
}

document.addEventListener("DOMContentLoaded", initialize);
