import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if __name__ == "__main__":
    # cli()
    from cambridgeScript.parser.lexer import parse_tokens
    from parser.parser import Parser
    from interpreter.variables import VariableState
    from interpreter.interpreter import Interpreter
    # file = open(sys.argv[1], 'r')
    file = open("cambridgeScript\\input.txt", 'r')
    code = file.read()
    tokens = parse_tokens(code)
    # for token in tokens:
    #     print(token)
    parsed = Parser.parse_program(tokens)
    for i in parsed.statements: print(i)
    interpreter = Interpreter(VariableState(), code)
    interpreter.visit(parsed)
    file.close()