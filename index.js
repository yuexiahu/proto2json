const protobuf = require("protobufjs");

if (process.argv.length < 3)
{
    console.error('Usage: ./proto2json message.proto namespace.type')
    console.error('  using stdin read protobuf encoded hex string')
    console.error('Example: echo "08 96 01\\n089601" | ./proto2json message.proto Test1')
    process.exit(1);
}

const protofile=process.argv[2];
const prototype=process.argv[3];

process.stdin.resume();
process.stdin.setEncoding('utf8');

let lingeringLine = "";

process.stdin.on('data', function(chunk) {
    lines = chunk.split("\n");

    lines[0] = lingeringLine + lines[0];
    lingeringLine = lines.pop();

    lines.forEach(decode);
});

process.stdin.on('end', function(line) {
    //console.log('end')
});

function decode(line) {
    line = line.replace(/\s/g, '');
    let buffer = Buffer.from(line, 'hex');
    protobuf.load(protofile, function(err, root) {
        if (err)
            throw err;

        // Obtain a message type
        var Message = root.lookupType(prototype);

        // Decode an Uint8Array (browser) or Buffer (node) to a message
        var message = Message.decode(buffer);
        // ... do something with message

        console.log(JSON.stringify(message, null, '  '))
        console.log()
    });

}
