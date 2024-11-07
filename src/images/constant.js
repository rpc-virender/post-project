import { projectprops } from "./commonImages";

export const reraStatusConst = { 
    Recieved : 101,
    Applied : 102,
    Not_Applied : 103,
    Ready_to_Move_or_Not_Applicable:104
};

export const csvInstructions = [
    "Please do not edit any heading column of a csv",
    "Please do not add or remove extra heading column in a csv",
    "Please add data in consecutive row for proper error detection",
    "Any problem you are facing while uploading csv do contact to our helpline number",
];

export const csvDetailsRequirements = [
    {
        id:1,
        name:"Unit Number",
        contant:"This field cannot be empty and should not be duplicate",
    },
    {
        id:2,
        name:"Unit Type",
        contant:"Must match one of the types listed in the CSV. This field cannot be empty. If any types are missing, contact the helpline",
    },
    {
        id:3,
        name:"Tower Name",
        contant:"Must match the name provided during the tower details submission. This field cannot be empty.",
    },
    {
        id:4,
        name:"Basement Available",
        contant:`The value should be either "yes" or "no"`,
    },
    {
        id:5,
        name:"Property On Floor",
        contant:"The floor number must be valid for the tower, starting from 0 if ground floor, 1 if stilt floor, and not empty",
    },
    {
        id:6,
        name:"Elevation",
        contant:"Must be a value between 1 to 10. This field cannot be empty",
    },
    {
        id:7,
        name:"Facing",
        contant:"Match a CSV value; if missing, contact the helpline or add from the dropdown. This field can't be empty",
    },
    {
        id:8,
        name:"Super Built-up Area",
        contant:" Must be a numeric value in sq.ft and greater than the carpet area. This field cannot be empty",
    },
    {
        id:9,
        name:"Carpet Area",
        contant:"Must be a numeric value in sq.ft and less than the super built-up area. This field cannot be empty",
    },
    {
        id:10,
        name:"No: of Car Parking",
        contant:" Must be between 0 to 10. If no parking is available, this field can be left empty. For more than 10 No.of parking, Please contact us",
    },
    {
        id:11,
        name:"Type of Parking",
        contant:"Must match one of the values listed in the CSV. If number of car parking is 0, this field can be left empty",
    },
    {
        id:12,
        name:"Total No: of Balconies",
        contant:"Must be between 0 to 10. If no balconies are available, this field can be left empty. For more than 10 balconies, Please contact us",
    },
    {
        id:13,
        name:"Total No: of Bathrooms",
        contant:"Must be Between 1 to 20. This field cannot be empty",
    },
    {
        id:14,
        name:"Plot Area",
        contant:"Must be a numeric value in sq.ft. This field cannot be empty",
    },
    {
        id:15,
        name:"Garden Area",
        contant:"Must be a numeric value in sq.ft. This field can be left empty if no garden area is present",
    },
    {
        id:16,
        name:"Terrace Area",
        contant:"Must be a numeric value in sq.ft. This field can be left empty if no terrace area is present",
    },
    {
        id:17,
        name:"Total Parking Area",
        contant:"Must be a numeric value in sq.ft. This field can be left empty if no.of Parking is 0",
    },
    {
        id:18,
        name:"Total Balcony Size",
        contant:"Must be a numeric value in sq. ft. This field can be left empty if no balcony is present.",
    },
    {
        id:19,
        name:"Length",
        contant:"Must be a numeric value in  ft. This field cannot be empty.",
    },
    {
        id:20,
        name:"Breadth",
        contant:"Must be a numeric value in ft. This field cannot be empty",
    },
];

export const mapBoxState = new Map([]);

export const projectResponseFinalData = new Map([]);
export const propertyResponseFinalData = new Map([]);


export const projectEncId = new Map([]);
export const listingEncId = new Map([]);

export const previousPages = new Map([
    ["prevPages", []]
]);

export const listingPreviousPages = new Map([
    ["prevPages", []]
]);

export const pageCount = new Map([]);
export const listingPageCount = new Map([]);

export const repeatCounterForMinMax = new Map([["count", 0]]);


export const reDirectToContact = (identifier, mobile) => {
    let url;

    if(identifier === "W"){
        url = `https://api.whatsapp.com/send?phone=+91${mobile}&text=Hello`;
        window.open( url, '_blank');
    }else{
        url = `tel:+91${mobile}`
        window.location.href = url;
    }
};


export const extractYouTubeVideoID = (url) => {
    try {
      const urlObj = new URL(url);
  
      // Check for different YouTube URL formats
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname === '/watch') {
          // Regular YouTube video (e.g., https://www.youtube.com/watch?v=yXDWL9v3inQ)
          return urlObj.searchParams.get('v');
        } else if (urlObj.pathname.startsWith('/shorts/')) {
          // YouTube Shorts (e.g., https://youtube.com/shorts/nkAhPHSs1Uw)
          return urlObj.pathname.split('/shorts/')[1];
        }
      } else if (urlObj.hostname === 'youtu.be') {
        // Shortened YouTube URL (e.g., https://youtu.be/yXDWL9v3inQ)
        return urlObj.pathname.substring(1);
      }
  
      return null; // Return null if no video ID is found
    } catch (error) {
      console.error('Invalid URL:', error);
      return null; // Return null if URL parsing fails
    }
};

export const approvalDetails = [
    {
        id: 1,
        name: "BDA (Bangalore Development Authority)",
        fullName:"Bangalore Development Authority"
    },
    {
        id: 2,
        name: "BBMP (Bruhat Bengaluru Mahanagara Palike)",
        fullName:"Bruhat Bengaluru Mahanagara Palike"
    },{
        id: 3,
        name: "BMRDA (Bangalore Metropolitan Region Development Authority)",
        fullName:"Bangalore Metropolitan Region Development Authority"
    },{
        id: 4,
        name: "MPA (Malur Planning Authority)",
        fullName:"Malur Planning Authority"
    },{
        id: 5,
        name: "APA (Asset Purchase Agreement)",
        fullName:"Asset Purchase Agreement"
    },{
        id: 6,
        name: "DTCP (Department of Town and Country Planning)",
        fullName:"Department of Town and Country Planning"
    },{
        id: 7,
        name: "BIAPPA (Bangalore International Airport Area Planning Authority)",
        fullName:"Bangalore International Airport Area Planning Authority"
    },{
        id: 8,
        name: "KUDA (Kalaburagi Urban Development Authority)",
        fullName:"Kalaburagi Urban Development Authority"
    },{
        id: 9,
        name: "MUDA (Mysore Urban Development Authority)",
        fullName:"Mysore Urban Development Authority"
    },{
        id: 10,
        name: "TUDA (Tumkur Urban Development Authority)",
        fullName:"Tumkur Urban Development Authority"
    },{
        id: 11,
        name: "KPA (Kanakapura Planning Authority)",
        fullName:"Kanakapura Planning Authority"
    },
];

export function formatDisplayNumber(number) {
    if(number !== "." && !isNaN(number)){
        return number % 1 === 0 ? number : parseFloat(number).toFixed(2);
    }
};

export function formatNumber(number) {
    if(number !== "." && !isNaN(number)){
        if(!number.toString().endsWith("0")){
            return number % 1 === 0 ? number : parseFloat(number.toFixed(2));
        }else{
            if(number.toString().endsWith("00")){
                return Math.trunc(number)
            }else{
                return number % 1 === 0 ? number : parseFloat(number).toFixed(2);
            }
        }
    }
};

export const convertSqmetersIntoAcres = (number, identifier) => {
    let base = 0.000247;
    let value;

    if(number !== "" && !number.toString().endsWith(".") && !number.toString().endsWith("0")){
        if(identifier === "acres"){
            value = number * base;
        }else{
            value = number / base;   
        }
    }else{
        value = number;
    }
    
    if(value){
        return identifier !== "acres" ? formatNumber(value) : value;
    }
};

export const convertSqmetersIntoSqft = (number, identifier) => {
    let base = 0.092903;
    let value;

    if(number !== "" && !number.toString().endsWith(".") && !number.toString().endsWith("0")){
        if(identifier === "sqmts"){
            value = number * base;
        }else{
            value = number / base;   
        }
    }else{
        value = number;
    }

    if(value){
        return identifier === "sqmts" ? formatNumber(value) : value;
    }
};

export const fixedToTw0Decimals = (value) =>{
    if(value.toString().includes(".")){
        return (Math.round(value * 100) / 100).toFixed(2)
    }else{
        return value;
    }
};

export const valuesValidity = {
    INT: { minimum: -2147483648, maximum: 2147483647},
    SMALLINT:{ minimum: -32768, maximum: 32767},
    BIGINT:{minimum: -9223372036854775808, maximum: 9223372036854775807},
    TINYINT:{ minimum: 0, maximum: 255},
    unSMALLINT:{Minimum: 0, Maximum: 65535}
};

export const convertToPlainText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.replace(/\n+/g, '\n').trim();
};

export function removeExtraLineBreaks(text) {
    if(text !== ""){
        let newText = text.replace(/(<p><br><\/p>)+$/g, '').replace(/^(<p><br><\/p>)+/g, ''); 
        return newText;
    } 
};

export const BASE_PATH_LISTING = "/residential/listings";
export const BASE_PATH_PROJECT_LISTING = "/residential-projects";
export const BASE_PATH_PROJECT_DETAILS = "/residential/projects";

export const slugify = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };
  
//   type ProjectLinkProps = {
//     // Keep all props from LinkProps
//     routeParams: {
//       city: string;
//       slug: string;
//       locality: string;
//     };
//     target?: "_blank" | "_self" | "_parent" | "_top";
//     children: ReactNode;
//     className?: string;
//   };
  
  // Function to create URL externally
  export const createProjectLinkUrl = (routeParams) => {
    const { city, slug, locality } = routeParams;
    return `${BASE_PATH_PROJECT_DETAILS}/${slugify(city)}/${slugify(
      locality
    )}/${slugify(slug)}`;
  };

  const slugifyBHKUnitType = (bhkUnitType) => {
    return bhkUnitType
      .toLowerCase() // Convert to lowercase
      .replace(/\+/g, "-with-") // Replace '+' with 'with'
      .replace(/\//g, "-or-") // Replace '/' with 'or'
      .replace(/[^a-z0-9.]+/g, "-") // Replace non-alphanumeric characters, but keep decimals
      .replace(/-+/g, "-") // Merge multiple hyphens into one
      .replace(/(^-|-$)/g, ""); // Remove leading or trailing hyphens
  };
  
  // Function to create URL externally
  export const generateListingLinkUrl = (routeParams) => {
    const { city, locality, projName, phase, bhkUnitType, propIdEnc, category } = routeParams;
    let url = `${
      projName ? BASE_PATH_PROJECT_LISTING : BASE_PATH_LISTING
    }/${category}/${slugify(city)}/${slugify(locality)}`;
    if (projName) url += `/${slugify(projName)}`;
    if (phase) url += `/${slugify(phase)}`;
    url += `/${slugifyBHKUnitType(bhkUnitType)}/listing-${propIdEnc}`;
    return url;
  };
  
export const compressImageTo2MB = (file, maxFileSize = 2 * 1024 * 1024, updateProgress) => {
    return new Promise((resolve, reject) => {
        if (file) {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            let progress = 0;  // Initialize progress at 0%
            updateProgress(progress); // Update the progress bar initially

            const reader = new FileReader();
            reader.onload = function(e) {
                progress += 20; // Reading the file is roughly 20% of the work
                updateProgress(progress); // Update progress to 20%
                img.src = e.target.result;
            };

            img.onload = function() {
                let quality = 0.9; // Start with high quality
                let compressionRatio = 1; // Start with full size
                let currentFileSize;

                const compressImage = () => {
                    // Update progress bar before resizing the image
                    progress += 5; // Drawing image on canvas is another 20% of the process
                    updateProgress(progress);

                    // Set the canvas size to the image size * compression ratio
                    canvas.width = img.width * compressionRatio;
                    canvas.height = img.height * compressionRatio;

                    // Draw the image on the canvas
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    // Convert canvas to Blob with the current quality
                    canvas.toBlob((blob) => {
                        currentFileSize = blob.size;

                        // Update progress bar after compression is done
                        progress += 5; // Compression accounts for 30% of the process
                        updateProgress(progress);

                        if (currentFileSize <= maxFileSize || quality <= 0.1) {
                            progress = 100; // Finish the process with 100%
                            updateProgress(progress);

                            // Create a compressed file from the Blob
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            // Decrease quality or size and try again
                            if (currentFileSize > maxFileSize) {
                                quality -= 0.05; // Decrease quality
                                compressionRatio -= 0.1; // Decrease size
                                compressImage(); // Re-run compression
                            }
                        }
                    }, 'image/jpeg', quality);
                };

                // Start compressing the image
                compressImage();
            };

            reader.readAsDataURL(file);

            reader.onerror = (error) => reject(error);
        } else {
            reject('No file provided');
        }
    });
};




export const checkOverViewData = (overview, propTypeIdd) => {
    let status = false;
    if (overview !== undefined && overview != null) {
      if ( overview.landArea !== undefined && overview.landArea != null && overview.landArea !== "" && overview.landArea !== 0 ) {
        status = true;
      }

      if( overview.basePrice !== undefined && overview.basePrice != null && overview.basePrice !== "" &&  overview.basePrice !== 0 ) {
        status = true;
      }

      if( overview.noOfUnit !== undefined && overview.noOfUnit != null && overview.noOfUnit !== "" &&  overview.noOfUnit !== 0 ) {
        status = true;
      }

      if ( propTypeIdd === projectprops.apartment || propTypeIdd === projectprops.villament ) {
        if ( overview.noOfTower !== undefined && overview.noOfTower !== null && overview.noOfTower !== "" && overview.noOfTower > 0 ) {
          status = true;
        }
      }
    };

    return status;
};

export const getUnit = (value, GroupData) =>{
    let res = "";
    if(GroupData !== undefined && GroupData !== ""){
        GroupData.map(item => {
            if(value === item.cid) {
                res = item.constDesc
            }
            else if(value === item.id) {
                res = item.name
            }
        })
    };
    return res;
};

export const mapEl = new Map([]);


// dummy static data

// export const phases = null;
// export const basicData = null;
// export const userName = "Sivaprasad";
// export const userType = "B";
// export const activeStatus = null;
// export const isLoggedin = null;
// export const page = null;
// export const lat = 12.957538;
// export const lang = 77.745208;






export const phases = [
    {
      "phaseId": 710,
      "projId": null,
      "possessionDate": "21/11/2024",
      "expectedCompletion": "14/11/2024",
      "phasePromoter": "Vv",
      "sequence": 1,
      "reraStatus": "102",
      "reraId": "3223",
      "launchDate": "06/11/2024",
      "isActive": "Y",
      "availableProperties": null,
      "phaseBrochure": 1,
      "phaseBrochureUrl": "https://getrightproperty-test-bucket-new.s3.ap-south-1.amazonaws.com/images/varify/proj/212/phase-710/brochure.pdf",
      "phaseName": "Phase 1"
    },
    {
      "phaseId": 711,
      "projId": null,
      "possessionDate": "20/11/2024",
      "expectedCompletion": "21/11/2024",
      "phasePromoter": "23",
      "sequence": 2,
      "reraStatus": "103",
      "reraId": null,
      "launchDate": "06/11/2024",
      "isActive": "Y",
      "availableProperties": null,
      "phaseBrochure": 0,
      "phaseBrochureUrl": null,
      "phaseName": "Vv"
    },
    {
      "phaseId": 712,
      "projId": null,
      "possessionDate": "28/11/2024",
      "expectedCompletion": "27/11/2024",
      "phasePromoter": "3223",
      "sequence": 3,
      "reraStatus": "102",
      "reraId": "3232",
      "launchDate": "26/11/2024",
      "isActive": "Y",
      "availableProperties": null,
      "phaseBrochure": 1,
      "phaseBrochureUrl": "https://getrightproperty-test-bucket-new.s3.ap-south-1.amazonaws.com/images/varify/proj/212/phase-712/brochure.pdf",
      "phaseName": "2323"
    },
    {
      "phaseId": 713,
      "projId": null,
      "possessionDate": "22/11/2024",
      "expectedCompletion": "20/11/2024",
      "phasePromoter": "32",
      "sequence": 4,
      "reraStatus": "102",
      "reraId": "32",
      "launchDate": "13/11/2024",
      "isActive": "Y",
      "availableProperties": null,
      "phaseBrochure": 0,
      "phaseBrochureUrl": null,
      "phaseName": "32"
    },
    {
      "phaseId": 714,
      "projId": null,
      "possessionDate": "28/11/2024",
      "expectedCompletion": "28/11/2024",
      "phasePromoter": "324",
      "sequence": 5,
      "reraStatus": "103",
      "reraId": null,
      "launchDate": "19/11/2024",
      "isActive": "Y",
      "availableProperties": null,
      "phaseBrochure": 0,
      "phaseBrochureUrl": null,
      "phaseName": "Hello"
    }
  ]
  
export const basicData = {
    "projName": "Bluelock F",
    "address": "Haneda Airport (HND), Haneda Airport, Ota City, Tokyo, Japan",
    "latitude": "35.54829639999999",
    "longitude": "139.7779951",
    "state": 11,
    "city": 9,
    "totalLandArea": "10.678303999999999",
    "phaseCount": 5,
    "whyBuyThisProject": "<p>dfsfd</p>",
    "aboutproject": "",
    "locality": 28,
    "isDeleted": "N",
    "pincode": 110045,
    "projAuthority": "712,713,714"
  }
  
export const userName = "Sivaprasad";
export const userType = "B";
export const activeStatus = null;
export const isLoggedin = null;
export const page = 6;
export const lat=12.957538;
export const lang=77.745208;