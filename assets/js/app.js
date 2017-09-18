jQuery( document ).ready(function() {
    console.log('loaded');

    /*
     * Let's define some mock entities
     * This would essentially be the data available from a customer API
     */
    function Entity(uuid, title, html) {
        this.uuid = uuid;
        this.title = title;
        this.html = html;
    }

    var Entities = {
        "e2102a7b-8d5c-41c7-a241-d4ede3c0a5f4": new Entity('e2102a7b-8d5c-41c7-a241-d4ede3c0a5f4', 'Google', '<p>This is the Google logo</p><img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" />'),
        "8c946aed-bb72-4b62-afa3-fd6244fd94eb": new Entity('8c946aed-bb72-4b62-afa3-fd6244fd94eb', 'Bing', '<p>This is the Bing logo</p><img src="http://logok.org/wp-content/uploads/2014/09/Bing-logo-2013.png" />')
    };

    /*
     * Acquia Lift Decision CallBack. Receive data about decision and change content before slot (since we are hiding all slots with Experience Builder closed)
     */
    window.addEventListener('acquiaLiftDecision', function(e) {
        console.log('decision made');
        console.log('Call API with following UUID');
        console.log(e.detail.decision_content_id);
        console.log('Received Content; Filtering on Front-end');
        //jQuery('[data-lift-slot="' + e.detail.decision_slot_id + '"]').before('<div><p>Replaced Content with UUID '+e.detail.decision_content_id+'</p></div>');
        filterContent(e.detail.decision_slot_id,e.detail.decision_content_id);
    });

    //Example of Content Replacement, potentially not needed
    window.addEventListener('acquiaLiftContentAvailable', function(e) {
        console.log('content replaced');
    });

    /*
     * Mock Function to filter content based on a datalayer
     */
    function filterContent(slot, uuid) {
        console.log(Entities[uuid]);
        //First, added a loaded class so CSS knows this has loaded and will show the slot area
        jQuery('[data-lift-slot="' + slot + '"]').addClass('loadedPersonalization');
        //Second, add the content from the API within a wrapper so css will show ONLY that content
        jQuery('[data-lift-slot="' + slot + '"]').prepend('<div class="personalizedFromAPI">'+Entities[uuid].html+"</div>");
    }

    /*
     * Attempt at hiding content with Experience Builder open
     * As of now, we need to continue to show iframed content with blue border or drag and drop will not work
     */
    $('body').on('DOMSubtreeModified', ".lift-static", function () {
        console.log($(this));
        if($('body').hasClass('lift-tools-active')) {
            if ($(this).find(".replaced").length) {
                console.log('exists');
            } else {
                $(this).addClass('inner-trusted-slot');
                $(this).prepend("<div class='replaced' style='width:100%;height:100%;background:#999999;padding:0 10px;visibility:visible !important;'>Personalized Content Preview Not Available</div>");
            }
        }
    });
});