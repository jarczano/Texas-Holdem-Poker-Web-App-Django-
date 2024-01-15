import openai

# Set small and big blind value
BB = 50
SB = 25

# To peek text information about game
show_game = False


# Here login to your OpenAI account. You need key to API. To get access to key can use Azure key vault, another service,
# or just write key
'''
key_vault_url = "https://apike.vault.azure.net/"
secret_name = "OpenAI"
credential = DefaultAzureCredential()
client = SecretClient(vault_url=key_vault_url, credential=credential)
openai_api_key = client.get_secret(secret_name).value
'''
# without azure key vault:
openai_api_key = 'xxx'

openai.api_key = openai_api_key




