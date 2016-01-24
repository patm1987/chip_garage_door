import subprocess

# SHA-1 of http://pux0r3.com/ - first 10 bytes
NAMESPACE_ID = [0xbe, 0x30, 0x15, 0x22, 0x6c, 0x7c, 0x77, 0x43, 0x0e, 0x94]
INSTANCE_ID = [0x00, 0x00, 0x00, 0x00, 0x00, 0x01]


def system_call(command):
    child = subprocess.Popen(
            ["-c", command],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            shell=True)
    child.communicate()


def start_advertising():
    system_call("sudo hcitool -i hci0 cmd 0x08 0x000a 01")


def stop_advertising():
    system_call("sudo hcitool -i hci0 cmd 0x08 0x000a 00")


def set_advertising_message(message):
    # Prepend the length of the whole message
    message.insert(0, len(message))

    # Pad message to 32 bytes for hcitool
    while len(message) < 32:
        message.append(0x00)

    # Make a list of hex strings from the list of numbers
    message = map(lambda x: "%02x" % x, message)

    # Concatenate all the hex strings, separated by spaces
    message = " ".join(message)
    system_call("sudo hcitool -i hci0 cmd 0x08 0x0008 " + message)


def set_eddystone_uid(ranging_data, namespace_id, beacon_id):
    assert (type(namespace_id) == list)
    assert (len(namespace_id) == 10)
    assert (type(beacon_id) == list)
    assert (len(beacon_id) == 6)

    payload = []
    payload.extend(namespace_id)
    payload.extend(beacon_id)
    payload.extend([0, 0])

    message = [
        0x02,  # flags length
        0x01,  # flags data type value - no clue what this is
        0x1a,  # flags data - no clue what this is

        # eddystone values
        0x03,  # Service UUID length
        0x03,  # Service UUID Service type value
        0xaa,  # 16-bit Eddystone uuid
        0xfe,  # 16-bit Eddystone uuid

        5 + len(payload),  # the size of the payload
        0x16,  # service data type
        0xaa,  # Eddystone uuid
        0xfe,  # Eddystone uuid
        0x00,  # Eddystone UID frame type
        ranging_data  # tx power
    ]
    message.extend(payload)
    set_advertising_message(message)
