$(function() {
    $("#send-dialog").dialog({
        autoOpen: false,
        height: 600,
        width: 350,
        modal: true,
        buttons: {
            "Add/Mod Flow": function() {
                var flow = {};
                var $label = $("#send-dialog fieldset label");
                var $input = $("#send-dialog fieldset input");
                $label.each(function(i, l) {
                    if($input.eq(i).val() != "") {
                        flow[$(this).text()] = $input.eq(i).val();
                    }
                });
                if(!jQuery.isEmptyObject(flow)) {
                    flow["command"] = "MOD";
                    flow = pruneFields(flow);
                    if(!(flow["ether-type"] && flow["netProtocol"])) {
                        delete flow["srcPort"];
                        delete flow["dstPort"];
                    }
                    console.log(JSON.stringify(flow));
                    sendJSONP(flow);
                }
                $(this).dialog("close");
            },
            "Del Flow": function() {
                var flow = {};
                var $label = $("#send-dialog fieldset label");
                var $input = $("#send-dialog fieldset input");
                $label.each(function(i, l) {
                    if($input.eq(i).val() != "") {
                        flow[$(this).text()] = $input.eq(i).val();
                    }
                });
                if(!jQuery.isEmptyObject(flow)) {
                    flow["command"] = "DEL";
                    flow = pruneFields(flow);
                    if(!(flow["ether-type"] && flow["netProtocol"])) {
                        delete flow["srcPort"];
                        delete flow["dstPort"];
                    }
                    console.log(JSON.stringify(flow));
                    sendJSONP(flow);
                }
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        },
        close: function() {
            $("#send-dialog fieldset input").each(function() {
                $(this).val("");
            });
        }
    });
    $("#actions-dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "Modify": function() {
                var flow = $(this).data("flow");
                flow["actions"] = $("#_actions").val();
                console.log(JSON.stringify(flow));
                sendJSONP(flow);
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        },
        close: function() {
            $("#actions-dialog fieldset input").each(function() {
                $(this).val("");
            });
        }
    });
    $("#send").click(function() {
        $("#send-dialog").dialog("open");
    });
});

function modFlow(i) {
    var flow = pruneFields(flows[i]);
    //flow = pruneFields(flow);
    flow["switch"] = node.id;
    if(flow["actions"][0]) {
        flow["actions"] =  flow["actions"][0].type.toLowerCase() + "=" + flow["actions"][0].value;
    }
    flow["command"] = "MOD_ST";
    $("#_actions").val(flow["actions"]);
    if(!(flow["ether-type"] && flow["netProtocol"])) {
        delete flow["srcPort"];
        delete flow["dstPort"];
    }

    for(var k in flow) {
        flow[k] = flow[k].toString();
    }

    $("#actions-dialog").data("flow", flow).dialog("open");
}

function delFlow(i) {
    var flow = pruneFields(flows[i]);
    if(flow["actions"][0]) {
        flow["actions"] = flow["actions"][0].type.toLowerCase() + "=" + flow["actions"][0].value;
    }
    flow["command"] = "DEL_ST";
    flow["switch"] = node.id;
    for(var k in flow) {
        flow[k] = flow[k].toString();
    }

    console.log(JSON.stringify(flow));
    sendJSONP(flow);
}

function pruneFields(f) {
    delete f["counterByte"];
    delete f["counterPacket"];
    delete f["srcIPMask"];
    delete f["dstIPMask"];
    if(f["srcMac"] == "00:00:00:00:00:00") {
        delete f["srcMac"];
    }
    if(f["srcIP"] == "0.0.0.0") {
        delete f["srcIP"];
    }
    if(f["srcPort"] == "0") {
        delete f["srcPort"];
    }
    if(f["dstMac"] == "00:00:00:00:00:00") {
        delete f["dstMac"];
    }
    if(f["dstIP"] == "0.0.0.0") {
        delete f["dstIP"];
    }
    if(f["dstPort"] == "0") {
        delete f["dstPort"];
    }
    if(f["ingreePort"] == "0") {
        delete f["ingreePort"];
    }
    if(f["tos-bits"] == "0") {
        delete f["tos-bits"];
    }
    if(f["vlan"] == "0") {
        delete f["vlan"];
    }
    if(f["netProtocol"] == "0") {
        delete f["netProtocol"];
    }

    if((f["srcIP"]) || (f["dstIP"]) || f["tos-bits"] || f["netProtocol"]) {
        f["ether-type"] = "2048";
    }

    return f;
}
